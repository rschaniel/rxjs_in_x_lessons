import { createTestScheduler } from '../../misc/test_scheduler';
import { withLatestFrom, startWith } from 'rxjs/operators';


describe('withLatestFrom', () => {

    it('needs values', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold, hot } = helpers;

            const source$ = cold('--a--b-c----d|');
            const result$ = source$.pipe(withLatestFrom(
                hot('------78|').pipe(startWith('0')),
            ));

            expectObservable(result$).toBe(
                '--a--b-c----d|',
                {
                    a: ['a', '0'],
                    b: ['b', '0'],
                    c: ['c', '8'],
                    d: ['d', '8'],
                }
            );
        });
    });
});
