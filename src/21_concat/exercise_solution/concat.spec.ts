import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, concat, interval } from 'rxjs';
import { testScheduler } from '../../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('concat', () => {
    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;
    
            const concatResult$ = concat(
                interval(1000).pipe(take(3)),
                cold('#'),
                of(3, 4),
            );

            expectObservable(concatResult$).toBe(
                '1s a 999ms b 999ms (c#)',
                { a: 0, b: 1, c: 2}
            );

        });
    });
});
