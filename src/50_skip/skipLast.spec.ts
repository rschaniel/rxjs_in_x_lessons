import { createTestScheduler } from '../misc/test_scheduler';
import { interval } from 'rxjs';
import { skipLast, take } from 'rxjs/operators';


describe('skipLast', () => {

    it('ignores the first x values', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                take(5),
                skipLast(2),
            );

            expectObservable(result$).toBe(
                '---ab(c|)',
                { a: 0, b: 1, c: 2 }
            );
        });
    });

    it('with unsubscribe', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, hot} = helpers;

            const source$ = hot(' 123456789');
            const subscription = '-^----! ';

            expectObservable(source$.pipe(skipLast(2)), subscription).toBe(
                '---abc',
                { a: '2', b: '3', c: '4' }
            );
        });
    });
});
