import { of, interval, Observable, timer, from, zip } from 'rxjs';
import { debounce, debounceTime, map, take } from 'rxjs/operators';


describe('debounce and debounceTime', () => {
    describe('debounce', () => {
        it('should silence values until other Observable emits', (done) => {
            interval(100).pipe(
                map(v => v + 1),
                take(10),
                debounce(sourceValue => timer(500 / sourceValue))
            ).subscribe({
                next: console.log,
                complete: done
            })
        });
    });

    describe('debounceTime', () => {
        it('without debounceTime', (done) => {
            const userInput$ = zip(
                from(['m', 'my', 'my s', 'my se', 'my search']),
                interval(100),
                (val, _) => val
            );

            userInput$.subscribe({
                next: console.log,
                complete: done
            })
        });

        it('should wait for the emission until inputs have calmed down', (done) => {
            const userInput$ = zip(
                from(['m', 'my', 'my s', 'my se', 'my search']),
                interval(100),
                (val, _) => val
            );

            userInput$.pipe(
                debounceTime(200),
            ).subscribe({
                next: console.log,
                complete: done
            })
        });
    });
});
