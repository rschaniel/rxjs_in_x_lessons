import { of, GroupedObservable, Observable, fromEvent, EMPTY, throwError } from 'rxjs';
import { bufferCount, filter, pairwise } from 'rxjs/operators';
import { testScheduler } from '../misc/test_scheduler';


describe('pairwise', () => {

    it('should emit pairs', () => {
        of(1,2,3,4).pipe(
            pairwise()
        ).subscribe(console.log);

        // [1,2]
        // [2,3]
        // [3,4]
    });

    it('should emit nothing', () => {
        testScheduler.run((helpers) => {
            const {expectObservable} = helpers;

            const result$ = of(1).pipe(
                pairwise()
            );

            expectObservable(result$).toBe('|');
        });
    });

    it('should also not emit anything', () => {
        EMPTY.pipe(
            pairwise()
        ).subscribe(console.log);
    });

    it('is different to bufferCount', () => {
        of(1,2,3,4).pipe(
            bufferCount(2, 1),
            filter(arr => arr.length === 2),
        ).subscribe(console.log);

        // [1,2]
        // [2,3]
        // [3,4]
    });
});
