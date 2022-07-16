import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, partition, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('partition', () => {

    it('splitting', () => {
        const [evens$, odds$] = partition(
            of(1, 2, 3, 4, 5, 6),
            x => x % 2 === 0
        );

        evens$.subscribe(console.log);
        odds$.subscribe(console.log);
    });

    it('split clicks', () => {

        const [clicksOnDiv$, otherClicks$] = partition(
            fromEvent(document, 'click'),
            // @ts-ignore
            ev => ev?.target?.tagName === 'DIV'
        );
    });

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const [evens$, odds$] = partition(
                interval(1).pipe(take(6)),
                x => x % 2 === 0
            );

            expectObservable(evens$).toBe('-a-b-c|', {a: 0, b: 2, c: 4});
            expectObservable(odds$).toBe(' --a-b-(c|)', {a: 1, b: 3, c: 5});
        });
    });
});
