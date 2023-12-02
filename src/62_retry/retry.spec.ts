import { createTestScheduler } from '../misc/test_scheduler';
import { mergeMap, retry } from 'rxjs/operators';
import { throwError, of } from 'rxjs';


describe('retry', () => {

    it('retries', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('abc#def').pipe(
                retry(2)
            );

            expectObservable(source$).toBe(
                'abcabcabc#'
            );
        });
    });

    it('retries and succeeds', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            let i = 0;
            const result$ = of('request').pipe(
                mergeMap(_ => ++i === 1 ? throwError(() => '503') : of('200')),
                retry(1),
            );

            expectObservable(result$).toBe(
                '(r|)', { r: '200' }
            );
        });
    });

    it('retries and succeeds with delay', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            let i = 0;
            const result$ = of('request').pipe(
                mergeMap(_ => ++i === 1 ? throwError(() => '503') : of('200')),
                retry({ count: 1, delay: () => cold('--t')}),
            );

            expectObservable(result$).toBe(
                '--(r|)', { r: '200' }
            );
        });
    });
});
