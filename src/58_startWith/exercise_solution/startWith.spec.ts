import { createTestScheduler } from '../../misc/test_scheduler';
import { startWith, take } from 'rxjs/operators';
import { interval } from 'rxjs';


describe('startWith', () => {

    it('start interval earlier', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const source$ = interval(4);
            const result$ = source$.pipe(take(3), startWith(-2, -1));

            expectObservable(result$).toBe(
                '(ab)c---d---(e|)',
                { a: -2, b: -1, c: 0, d: 1, e: 2 }
            );
        });
    });
});
