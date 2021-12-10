import { of, Observable, generate, asapScheduler } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';


describe('generate', () => {

    it('should generate the numbers 1 to 5', () => {
        const numbers$ = generate(1, x => x <= 5, x => x + 1, x => x, undefined);

        numbers$.subscribe({ next: console.log });
    });

    it('should test the generation of numbers 1 to 5', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const numbers$ = generate(1, x => x <= 5, x => x + 1, x => x, asapScheduler);

            expectObservable(numbers$).toBe('(abcde|)', {a: 1, b: 2, c: 3, d: 4, e: 5});
        });
    });
});
