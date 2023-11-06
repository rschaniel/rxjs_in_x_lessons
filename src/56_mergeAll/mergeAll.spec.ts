import { createTestScheduler } from '../misc/test_scheduler';
import { map, mergeAll, take } from 'rxjs/operators';
import { interval } from 'rxjs';


describe('mergeAll', () => {

    it('just merges the values as they occur', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const indexedValues = ['a', 'b', 'c', 'd'];

            const source$ = interval(100).pipe(
                take(4),
                map((outerV) => interval(100).pipe(
                    map(_ => indexedValues[outerV]),
                    take(2)),
                )
            );
            const result$ = source$.pipe(mergeAll());

            expectObservable(result$).toBe(
                '200ms a 99ms (ab) 96ms (bc) 96ms (cd) 96ms (d|)',
                { a: 'a', b: 'b', c: 'c', d: 'd' }
            );
        });
    });
});
