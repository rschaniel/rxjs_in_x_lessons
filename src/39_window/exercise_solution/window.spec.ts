import { of, interval, Observable, OperatorFunction, pipe } from 'rxjs';
import { mergeMap, take, toArray, window } from 'rxjs/operators';


describe('window', () => {

    it('buffer based on window', (done) => {
        const myBuffer = function<T>(closingNotifier: Observable<any>): OperatorFunction<T, unknown> {
            return pipe(
                window(closingNotifier),
                mergeMap((w: Observable<T>) => w.pipe(toArray())),
            )
        };

        interval(1).pipe(
            take(10),
            myBuffer(interval(3)),
        ).subscribe({
            next: console.log,
            complete: done
        })
    });
});
