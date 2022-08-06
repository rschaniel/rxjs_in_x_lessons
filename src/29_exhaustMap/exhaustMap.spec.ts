import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { delay, exhaustMap, map, take } from 'rxjs/operators';


describe('exhaustMap', () => {

    it('should emit', () => {
        const result$ = of(1,2,3).pipe(
           exhaustMap((v: number) => of(`value ${v}`))
        );

        result$.subscribe(console.log);
    });

    it('should ignore', (done) => {
        const result$ = interval(1).pipe(
            take(8),
            exhaustMap((v: number) => of(v).pipe(
                delay(5),
            )
        ));

        result$.subscribe({
            next: (v) => console.log(v),
            complete: () => done(),
        });
        // 0
        // 4
    });

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(2),
                exhaustMap((v: number) => interval(1000).pipe(take(2)))
            );

            expectObservable(result$).toBe(
                '2001ms ab 998ms c(d|)',
                { a: 0, b: 1, c: 0, d: 1}
            );
        });
    });
});
