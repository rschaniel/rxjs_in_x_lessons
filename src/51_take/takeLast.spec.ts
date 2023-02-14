import { createTestScheduler } from '../misc/test_scheduler';
import { interval } from 'rxjs';
import { take, takeLast } from 'rxjs/operators';


describe('takeLast', () => {

    it('emits the last x values', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                take(5),
                takeLast(2),
            );

            expectObservable(result$).toBe(
                '-----(ab|)',
                { a: 3, b: 4 }
            );
        });
    });
});
