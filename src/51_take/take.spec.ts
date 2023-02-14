import { createTestScheduler } from '../misc/test_scheduler';
import { EMPTY, interval } from 'rxjs';
import { take } from 'rxjs/operators';


describe('take', () => {

    it('takes the first x values', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                take(3)
            );

            expectObservable(result$).toBe(
                '-ab(c|)',
                { a: 0, b: 1, c: 2 }
            );
        });
    });

    it('runs into no error when no values', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = EMPTY.pipe(
                take(1),
            );

            expectObservable(result$).toBe('|', null);
        });
    });
});
