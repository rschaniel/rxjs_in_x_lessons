import { of, GroupedObservable, Observable, fromEvent, EMPTY, throwError } from 'rxjs';
import { scan } from 'rxjs/operators';


describe('scan', () => {

    it('should continuously execute the reducer function', () => {
        of(1,2,3,4).pipe(
            scan((acc, curr) => acc + curr, 0)
        ).subscribe(console.log);

        // 1
        // 3
        // 6
        // 10
    });

    it('should work without seed value', () => {
        of(1,2,3,4).pipe(
            scan((acc, curr) => acc + curr)
        ).subscribe(console.log);

        // 1
        // 3
        // 6
        // 10
    });

    it('can keep a state', () => {
        of(1,15,7,3,20,2).pipe(
            scan((acc, curr) => acc > curr ? acc : curr)
        ).subscribe(console.log);

        // 1
        // 15
        // 15
        // 15
        // 20
        // 20
    });
});
