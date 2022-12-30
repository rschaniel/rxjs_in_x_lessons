import { createTestScheduler } from '../../misc/test_scheduler';
import { interval } from 'rxjs';
import { filter, take } from 'rxjs/operators';


describe('skip', () => {

    it('ignores the first x values', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                take(5),
                filter((_, index) => 2 <= index)
            );

            expectObservable(result$).toBe(
                '---ab(c|)',
                { a: 2, b: 3, c: 4 }
            );
        });
    });
});
