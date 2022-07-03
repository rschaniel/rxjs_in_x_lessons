import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, forkJoin, interval } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('forkJoin', () => {

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const concatResult$ = forkJoin(
                interval(1000).pipe(take(3)),
                of(3, 4),
            );

            expectObservable(concatResult$).toBe(
                '1s a 999ms b 999ms (cde|)',
                { a: 0, b: 1, c: 2, d: 3, e: 4}
            );

        });
    });
});
