import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, merge, interval } from 'rxjs';
import { testScheduler } from '../../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('merge', () => {

    it('marbles testing fail case', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            const mergeResult$ = merge(
                interval(1000).pipe(take(3)),
                cold('1.5s #')
            );

            expectObservable(mergeResult$).toBe(
                '1s a 499ms #',
                { a: 0}
            )
        });
    });
});
