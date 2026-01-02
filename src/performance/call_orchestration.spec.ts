import { createTestScheduler } from '../misc/test_scheduler';
import { take, switchMap, map } from 'rxjs/operators';
import { merge, forkJoin } from 'rxjs';


describe('call orchestration', () => {

    it('is sequential', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const backendCall = cold('-(1|)');
            const backendCall2 = cold('-(2|)');

            const source$ = backendCall.pipe(
                switchMap(() => backendCall2),
                take(1),
            );

            expectObservable(source$).toBe(
                '--(a|)', { a: '2' });
        });
    });

    it('is parallel', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const backendCall = cold('-(1|)');
            const backendCall2 = cold('-(2|)');

            const source$ = forkJoin({
                result1: backendCall,
                result2: backendCall2
            }).pipe(
                map(results => results.result2),
                take(1),
            );

            expectObservable(source$).toBe(
                '-(a|)', { a: '2' });
        });
    });
});
