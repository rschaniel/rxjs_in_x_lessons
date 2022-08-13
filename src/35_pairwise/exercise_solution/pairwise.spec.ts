import { of, GroupedObservable, Observable, fromEvent, EMPTY, throwError, OperatorFunction } from 'rxjs';
import { bufferCount, filter } from 'rxjs/operators';


/* Not following the official RxJS operator principles! */
function triplet<T>(): OperatorFunction<T, T[]> {
    return (source) => source.pipe(
        bufferCount(3, 1),
        filter((arr: T[]) => arr.length === 3),
    );
}


describe('triplet', () => {

    it('should emit triplets', () => {
        of(1,2,3,4).pipe(
            triplet()
        ).subscribe(console.log)
    });
});

