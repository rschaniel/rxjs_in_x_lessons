import { of, GroupedObservable, Observable, fromEvent } from 'rxjs';
import { mergeMap } from 'rxjs/operators';


describe('mergeMap', () => {

    it('should map and merge', () => {
        const result$ = of(1,2,3,4).pipe(
            mergeMap(v => of(v * 2)),
        );

        result$.subscribe((v) => console.info(v));
        // 2
        // 4
        // 6
        // 8
    });
});
