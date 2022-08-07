import { of, GroupedObservable, Observable } from 'rxjs';
import { groupBy, mergeMap, toArray } from 'rxjs/operators';


describe('groupBy', () => {

    it('should group', () => {
        const result$: Observable<GroupedObservable<boolean, number>> = of(1,2,3,4,5,6).pipe(
            groupBy(v => v % 2 === 0),
        );

        result$.forEach(group$ => {
            group$.subscribe({
                next: v => console.log(`Group for key ${group$.key} emitted ${v}`)
            })
        });
    });

    it('should group and merge', () => {
        const result$: Observable<number[]> = of(1,2,3,4,5,6).pipe(
            groupBy(v => v % 2 === 0),
            mergeMap(group => group.pipe(toArray()))
        );

        result$.subscribe(console.log);
    });
});
