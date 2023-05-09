import { of, interval } from 'rxjs';
import { combineLatestAll, map, take } from 'rxjs/operators';


describe('combineLatestAll', () => {

    it('combines', () => {
        const source$ = of('a', 'b', 'c');

        source$.pipe(
            map(_ => interval(1000).pipe(take(3))),
            combineLatestAll()
        ).subscribe(
            console.log
        );

        // [ 0, 0, 0 ]
        // [ 1, 0, 0 ]
        // [ 1, 1, 0 ]
        // [ 1, 1, 1 ]
        // [ 2, 1, 1 ]
        // [ 2, 2, 1 ]
        // [ 2, 2, 2 ]
    });
});
