import { createTestScheduler } from '../misc/test_scheduler';
import { combineLatestAll, interval, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';


describe('combineLatestAll', () => {

    it('waits until every observable emitted once', (done) => {
        const source$ = interval(1000).pipe(take(2));

        const result$ = source$.pipe(
            map(outer =>
                interval(1000).pipe(
                    map(inner => `${outer} and ${inner}`),
                    take(2)
                )
            )
        );

        result$
            .pipe(combineLatestAll())
            .subscribe({
                next: console.log,
                complete: done,
                error: console.error,
            });

        // [ '0 and 0', '1 and 0' ]
        // [ '0 and 1', '1 and 0' ]
        // [ '0 and 1', '1 and 1' ]
    });

    it('combines', () => {
        createTestScheduler().run((helpers) => {
            const {cold} = helpers;

            const source$ = cold('-1-2-|', {'1': 1, '2': 2});
            const b: (id: number) => Observable<string> = (id: number) => {
                return cold('-ij', {
                    i: `1st response ID ${id}`,
                    j: `2nd response ID ${id}`,
                });
            };

            const result$ = source$.pipe(
                map(o => b(o)),
                combineLatestAll(),
            );

            result$.subscribe(console.log);
            // [ '1st response ID 1', '1st response ID 2' ]
            // [ '2nd response ID 1', '1st response ID 2' ]
            // [ '2nd response ID 1', '2nd response ID 2' ]
        });
    });
});
