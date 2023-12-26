import { createTestScheduler } from '../../misc/test_scheduler';
import { delay, repeat, take, toArray } from 'rxjs/operators';
import { interval } from 'rxjs';


describe('toArray', () => {

    it('works with marbles', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(3),
                toArray(),
                delay(1),
                repeat(4),
            );

            expectObservable(result$).toBe(
                '----w---x---y---(z|)',
                {
                    w: [0, 1, 2],
                    x: [0, 1, 2],
                    y: [0, 1, 2],
                    z: [0, 1, 2],
                }
            );
        });
    });
});
