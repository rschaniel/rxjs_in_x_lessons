import { createTestScheduler } from '../misc/test_scheduler';
import { interval } from 'rxjs';
import { take, throttleTime } from 'rxjs/operators';


describe('throttleTime', () => {

    it('throttles', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                take(10),
                throttleTime(3),
            );

            expectObservable(result$).toBe(
                '-a---b---c|',
                { a: 0, b: 4, c: 8 }
            );
        });
    });
});
