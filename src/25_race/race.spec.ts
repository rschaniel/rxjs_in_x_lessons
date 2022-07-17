import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, race, interval, EMPTY } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { filter, take, tap } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';


describe('race', () => {

    it('demo with interval', () => {
        const winner$ = race(
           interval(1500),
           interval(1000),
           interval(2000),
        );
        winner$.subscribe();
    });

    it('should use the winner', (done) => {
        const winner$ = race(
           interval(1500).pipe(tap(_ => console.log('interval(1500) won'))),
           interval(1000).pipe(tap(_ => console.log('interval(1000) won')), take(5)),
           interval(2000).pipe(tap(_ => console.log('interval(2000) won'))),
        );
        winner$.subscribe({ next: console.log, complete: () => done() });
    });

    it('should use the winner when calling multiple APIs', (done) => {
        const response$ = race(
           ajax('http://api-a.ronnieschaniel.com/api/articles'),
           ajax('http://api-b.ronnieschaniel.com/api/articles'),
        );
        response$.subscribe();
    });


    it('race with of and filter', (done) => {
        const winner$ = race(
           of(1).pipe(filter(v => v > 10)),
           of(2),
           interval(1000),
        );
        winner$.subscribe({ next: console.log, complete: () => done() });
    });


    it('does not emit a value', (done) => {
        const winner$ = race(
            EMPTY,
            interval(1000),
        );
        winner$.subscribe({ next: console.log, complete: () => done() });
    });

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const concatResult$ = race(
                interval(1000).pipe(take(3)),
                interval(2000),
            );

            expectObservable(concatResult$).toBe(
                '1s a 999ms b 999ms (c|)',
                { a: 0, b: 1, c: 2, d: 3 }
            );

        });
    });

    it('marbles testing with simultaneous output', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            const concatResult$ = race(
                cold('3ms a', { a: 'first input'}),
                cold('3ms b', { b: 'second input'}),
            );

            expectObservable(concatResult$).toBe(
                '3ms a',
                { a: 'first input' }
            );

        });
    });
});
