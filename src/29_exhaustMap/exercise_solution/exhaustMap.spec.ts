import { of, Observable, throwError, asyncScheduler, Subject } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { delay, exhaustMap, take, tap } from 'rxjs/operators';


describe('exhaustMap', () => {

    it('should keep the ignored in a list', (done) => {
        const ignored: number[] = [];

        const result$ = interval(1).pipe(
            take(8),
            tap((v: number) => ignored.push(v)),
            exhaustMap((v: number) => of(v).pipe(
                delay(5),
            )),
            tap((consideredNumber: number) => {
                const index = ignored.findIndex((v) => v === consideredNumber);
                if (index > -1) {
                    ignored.splice(index, 1);
                }
            }),
        );

        result$.subscribe({
            next: (v) => console.log(v),
            complete: () => {
                console.log(ignored);
                // 1,3,4,5,7
                done();
            },
        });
        // 2
        // 6
    });
});
