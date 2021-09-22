import { of, Observable, EMPTY, interval } from 'rxjs';
import { mergeMap, take } from 'rxjs/operators';
import { testScheduler } from '../misc/test_scheduler';


describe('EMPTY', () => {

    it('should just complete', () => {
        EMPTY.subscribe({
            next: () => console.log('Next'),
            complete: () => console.log('Complete!')
        });
    });

    it('should work together with mergeMap', (done) => {
        const interval$ = interval(1000);
        const result = interval$.pipe(
            mergeMap(x => x % 2 === 1 ? of('a', 'b', 'c') : EMPTY),
        );
        result.subscribe(x => console.log(x));

        setTimeout(() => done(), 5000);
    });

    it('should be testable with marbles', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;
            const interval$ = interval(1);
            const result$ = interval$.pipe(
                mergeMap(x => x % 2 === 1 ? of(x) : EMPTY),
                take(3)
            );

            expectObservable(result$).toBe('--a-b-(c|)', {a: 1, b: 3, c: 5});
        });
    });
});
