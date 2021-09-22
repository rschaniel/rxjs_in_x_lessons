import { of, Observable, from, queueScheduler } from 'rxjs';
import { take } from 'rxjs/operators';
import { testScheduler } from '../misc/test_scheduler';


describe('from', () => {

    it('should build from various constructs', () => {
        from([1,2,3]).subscribe({ next: console.log });
        // 1, 2, 3
    });

    it('should take a generator as input', () => {
        function* generateDoubles(seed) {
            let i = seed;
            while (true) {
                yield i;
                i = 2 * i; // double it
            }
        }

        const iterator = generateDoubles(2);

        from(iterator).pipe(
            take(10)
        ).subscribe({ next: console.log });

        // 2, 4, 8, 16, 32, 64, 128, 256, 512, 1024
    });

    it('should marble test', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = from([1,2,3]);

            expectObservable(result$).toBe('(abc|)', {a: 1, b: 2, c: 3});
        });
    });

    it('should output at different points in time', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = from([1,2,3], queueScheduler);

            expectObservable(result$).toBe('(abc|)', {a: 1, b: 2, c: 3});
        });
    });

    it('should output each character separately', () => {
        from('hello').subscribe({ next: console.log });
    });
});
