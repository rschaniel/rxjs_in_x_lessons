import { createTestScheduler } from '../misc/test_scheduler';
import { interval } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';


describe('skipWhile', () => {

    it('skips the values until the notifier emits', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = interval(1).pipe(
                take(5),
                skipWhile(x => x < 2)
            );

            expectObservable(result$).toBe(
                '---ab(c|)',
                { a: 2, b: 3, c: 4 }
            );
        });
    });
});
