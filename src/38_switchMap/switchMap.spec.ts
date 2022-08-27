import { of, interval, Observable } from 'rxjs';
import { delay, map, switchMap, take } from 'rxjs/operators';


describe('switchMap', () => {

    it('should switch', (done) => {
        of('a','b','c','d').pipe(
            switchMap(x => of(`1.${x}`, `2.${x}`).pipe(delay(100)))
        ).subscribe({
            next: console.log,
            complete: done
        });
        // 1.d
        // 2.d
    });

    it('should switch but still emit completed inner Observable values', (done) => {
        interval(1000).pipe(
            take(3),
            switchMap(x => interval(700).pipe(
                    take(2),
                    map(y => `${x}.${y}`),
                )
            )
        ).subscribe({
            next: console.log,
            complete: done
        });
        // 0.0
        // 1.0
        // 2.0
        // 2.1
    });


});
