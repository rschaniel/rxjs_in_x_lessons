import { createTestScheduler } from '../../misc/test_scheduler';
import { defaultIfEmpty, first } from 'rxjs/operators';
import { EmptyError } from 'rxjs';


describe('defaultIfEmpty', () => {

    it('errors out', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold('---|').pipe(
                first(),
            );

            expectObservable(result$).toBe(
                '---#', null,
                new EmptyError()
            );
        });
    });

    it('delivers a default', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold('---|').pipe(
                defaultIfEmpty(0),
                first(),
            );

            expectObservable(result$).toBe(
                '---(d|)',
                {
                    d: 0,
                }
            );
        });
    });
});
