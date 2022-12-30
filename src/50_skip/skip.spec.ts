import { createTestScheduler } from '../misc/test_scheduler';
import { interval } from 'rxjs';
import { skip, take } from 'rxjs/operators';


describe('skip', () => {

    it('ignores the first x values', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                take(5),
                skip(2)
            );

            expectObservable(result$).toBe(
                '---ab(c|)',
                { a: 2, b: 3, c: 4 }
            );
        });
    });

    it('runs into an error if no values', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                take(5),
                skip(5)
            );

            expectObservable(result$).toBe('-----|', null);
        });
    });
});
