import { createTestScheduler } from '../misc/test_scheduler';
import { interval } from 'rxjs';
import { skipUntil, take } from 'rxjs/operators';


describe('skipUntil', () => {

    it('skips the values until the notifier emits', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const notifier$ = cold('---r', { r: 'response' });

            const result$ = interval(1).pipe(
                take(5),
                skipUntil(notifier$)
            );

            expectObservable(result$).toBe(
                '---ab(c|)',
                { a: 2, b: 3, c: 4 }
            );
        });
    });
});
