import { createTestScheduler } from '../misc/test_scheduler';
import { interval } from 'rxjs';
import { take, throttle } from 'rxjs/operators';


describe('throttle', () => {

    it('throttles', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                take(11),
                throttle(() => interval(2))
            );

            expectObservable(result$).toBe(
                '-a--b--c--d|',
                { a: 0, b: 3, c: 6, d: 9 }
            );
        });
    });
});
