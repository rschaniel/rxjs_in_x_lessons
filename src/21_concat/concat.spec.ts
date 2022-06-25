import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, concat, interval } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('concat', () => {

    it('should emit in order', () => {
        concat(
            of(1, 2, 3),
            of('a', 'b'),
        ).subscribe({ next: console.log });
        // 1
        // 2
        // 3
        // a
        // b
    });

    it('should execute "requests" in order', () => {
        const updateRequest$ = of("updated 1");
        const fetchRequest$ = of([{"id": 1, "value": true},{"id": 2, "value": false}]);

        concat(
            updateRequest$,
            fetchRequest$,
        ).subscribe({ next: console.log });
        // updated 1
        // [ { id: 1, value: true }, { id: 2, value: false } ]
    });

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const concatResult$ = concat(
                interval(1000).pipe(take(3)),
                of(3, 4),
            );

            expectObservable(concatResult$).toBe(
                '1s a 999ms b 999ms (cde|)',
                { a: 0, b: 1, c: 2, d: 3, e: 4}
            );

        });
    });
});
