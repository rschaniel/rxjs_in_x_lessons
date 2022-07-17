import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, race, interval, merge } from 'rxjs';
import { testScheduler } from '../../misc/test_scheduler';
import { first } from 'rxjs/operators';


describe('race, but only first value', () => {

    it('with race itself', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            const raceResult$ = race(
                cold('-a', { a: 0}),
                cold('--b', { b: 5}),
            ).pipe(first());

            expectObservable(raceResult$).toBe(
                '-(a|)',
                { a: 0 }
            );

        });
    });

    it('with merge', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            const mergeResult$ = merge(
                cold('-a', { a: 0}),
                cold('--b', { b: 5}),
            ).pipe(first());

            expectObservable(mergeResult$).toBe(
                '--(a|)',
                { a: 0 }
            );

        });
    });
});
