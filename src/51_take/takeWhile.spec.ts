import { createTestScheduler } from '../misc/test_scheduler';
import { interval } from 'rxjs';
import { takeWhile } from 'rxjs/operators';


describe('takeWhile', () => {

    it('takes the values while a conditions holds true', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = interval(1).pipe(
                takeWhile(x => x < 3)
            );

            expectObservable(result$).toBe(
                '-abc|',
                { a: 0, b: 1, c: 2 }
            );
        });
    });
});
