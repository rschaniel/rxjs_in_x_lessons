import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, forkJoin, interval } from 'rxjs';
import { testScheduler } from '../../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('forkJoin', () => {

    it('should run into an error if input observables error out', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            const forkJoinResult$ = forkJoin(
                interval(1000).pipe(take(3)),
                cold('-#'),
                of('a', 'b'),
            );

            expectObservable(forkJoinResult$).toBe(
                '-#'
            );
        });
    });
});
