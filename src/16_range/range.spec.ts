import { of, Observable, range, asyncScheduler } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';


describe('range', () => {

    it('should emit', () => {
        range(1, 5).subscribe({ next: console.log });
        // 1
        // 2
        // 3
        // 4
        // 5
        // complete
    });

    it('should emit non integers', () => {
        range(1.5, 3).subscribe({ next: console.log });
        // 1.5
        // 2.5
        // 3.5
        // complete
    });

    it('should emit without count', () => {
        range(5).subscribe({ next: console.log });
        // 0
        // complete
    });

    it('should emit with timing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const numbers$ = range(1, 3);

            expectObservable(numbers$).toBe('(123|)', {'1': 1, '2': 2, '3': 3});
        });
    });
});
