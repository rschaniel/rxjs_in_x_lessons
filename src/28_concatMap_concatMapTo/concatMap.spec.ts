import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { concatMap, take } from 'rxjs/operators';


describe('concatMap', () => {

    it('will work on the inner observable and output in sequential fashion', () => {
        const result$ = of(1,2,3).pipe(
            concatMap((v: number) => of(`value ${v}`))
        );

        result$.subscribe(console.log);
        // value 1
        // value 2
        // value 3
    });

    it('works on async task in sequential fashion', () => {
        const update: (id: number) => Observable<string> = (id: number) => of(id + ' updated');

        const result$ = of(1,2,3).pipe(
            concatMap((id: number) => update(id))
        );

        result$.subscribe(console.log);
        // 1 updated
        // 2 updated
        // 3 updated
    });

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1000).pipe(
                take(2),
                concatMap((v: number) => interval(1).pipe(take(2)))
            );

            expectObservable(result$).toBe(
                '1001ms ab 998ms c(d|)',
                { a: 0, b: 1, c: 0, d: 1}
            );
        });
    });
});
