import { of, GroupedObservable, Observable, fromEvent, EMPTY, throwError, interval } from 'rxjs';
import { map, scan, take } from 'rxjs/operators';


describe('scan', () => {

    it('should deliver the fibonacci numbers', done => {
        interval(1).pipe(
            map(n => n + 1),
            scan(([n1, n2]) => [n2, n1 + n2], [0, 1]),
            map(([n1, n2]) => n2),
            take(7),
        ).subscribe({
            next: (x) => console.log(x),
            complete: done
        });

        // 1
        // 2
        // 3
        // 5
        // 8
        // 13
        // 21
    });
});
