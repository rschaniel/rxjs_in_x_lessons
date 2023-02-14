import { createTestScheduler } from '../../misc/test_scheduler';
import { interval } from 'rxjs';
import { take, throttle } from 'rxjs/operators';


describe('throttle', () => {

    it('throttles', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                take(11),
                throttle((v: number) => {
                    const throttleDuration = v < 5 ? v : 5;
                    return interval(throttleDuration);
                })
            );

            expectObservable(result$).toBe(
                '-ab-c---d--|',
                { a: 0, b: 1, c: 3, d: 7 }
            );
        });
    });
});
