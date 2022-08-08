import { of, GroupedObservable, Observable, fromEvent, interval } from 'rxjs';
import { map, mergeMap, take } from 'rxjs/operators';


describe('mergeMap', () => {

    it('should map and merge', (done) => {
        const result$ = of(1,2,3,4).pipe(
            mergeMap((v: number, index: number) => interval(1000/(index+1))
                .pipe(
                    take(1),
                    map(i => `emitted value for ${v}(waiting time ${1000 / (index+1)})`)
                ),
            1),
        );

        result$.subscribe({
            next: console.log,
            complete: () => done(),
        });
        // emitted value for 1(waiting time 1000)
        // emitted value for 2(waiting time 500)
        // emitted value for 3(waiting time 333.3333333333333)
        // emitted value for 4(waiting time 250)
    });
});
