import { createTestScheduler } from '../misc/test_scheduler';
import { interval } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';


describe('takeUntil', () => {

    it('takes the values until the notifier emits', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const notifier$ = cold('---r', { r: 'response' });

            const result$ = interval(1).pipe(
                takeUntil(notifier$)
            );

            expectObservable(result$).toBe(
                '-ab|',
                { a: 0, b: 1 }
            );
        });
    });

    it('all values are emitted if the notifier just completes without value', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const notifier$ = cold('-|');

            const result$ = interval(1).pipe(
                take(5),
                takeUntil(notifier$)
            );

            expectObservable(result$).toBe(
                '-abcd(e|)',
                { a: 0, b: 1, c: 2, d: 3, e: 4 }
            );
        });
    });
});
