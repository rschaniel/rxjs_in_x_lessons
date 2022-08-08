import { of, GroupedObservable, Observable, fromEvent } from 'rxjs';
import { mergeScan } from 'rxjs/operators';


describe('mergeScan', () => {

    it('should sum up values', () => {
        const result$ = of(1,2,3,4).pipe(
            mergeScan((acc, cur) => of(acc + cur), 0)
        );

        result$.subscribe((v) => console.info(v));
        // 1
        // 3
        // 6
        // 10
    });
});
