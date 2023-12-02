import { createTestScheduler } from '../../misc/test_scheduler';
import { mergeMap, retry } from 'rxjs/operators';
import { throwError, of } from 'rxjs';


describe('retry', () => {

    it('retries and succeeds with delay', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            let i = 0;
            const result$ = of('request').pipe(
                mergeMap(_ => ++i < 3 ? throwError(() => '503') : of('200')),
                retry({ count: 2, delay: (error, retryCount) => {
                        if (error === '503' && retryCount == 2) {
                            return cold('---t');
                        }
                        return cold('--t');
                    }}),
            );

            expectObservable(result$).toBe(
                '-----(r|)', { r: '200' }
            );
        });
    });
});
