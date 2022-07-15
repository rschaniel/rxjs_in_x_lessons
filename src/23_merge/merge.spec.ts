import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, merge, interval } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('merge', () => {

    it('merging two input observables', () => {
        const mergeResult$ = merge(
            interval(1000).pipe(take(3)),
            interval(1000).pipe(take(2)),
        );

        mergeResult$.subscribe(console.log);
        // 0, 0, 1, 1, 2
    });

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const mergeResult$ = merge(
                interval(1000).pipe(take(3)),
                interval(1000).pipe(take(2)),
            );

            expectObservable(mergeResult$).toBe(
                '1s (aa) 996ms (bb) 996ms (c|)',
                { a: 0, b: 1, c: 2}
            )
        });
    });
});
