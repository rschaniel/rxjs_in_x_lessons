import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, partition, interval, fromEvent } from 'rxjs';
import { take } from 'rxjs/operators';


describe('partition', () => {

    it('subscribing late', (done) => {
        const [evens$, odds$] = partition(
            interval(1).pipe(take(6)),
            x => x % 2 === 0
        );

        evens$.subscribe(console.log);
        setTimeout(() => {
            odds$.subscribe(console.log);
        }, 3);

        setTimeout(() => done(), 3000);
        // 0, 2, 1, 4, 3, 5
    });

    it('subscribing with logs', () => {
        let subscriberCount = 0;
        const inputObservable$ = new Observable<number>((subscriber) => {
            console.log('subscription happened');
            subscriberCount++;
            subscriber.next(1);
            subscriber.next(2);
            subscriber.next(3);
            subscriber.complete();
        });

        const [evens$, odds$] = partition(
            inputObservable$,
            x => x % 2 === 0
        );

        evens$.subscribe();
        odds$.subscribe();
        expect(subscriberCount).toEqual(2);
    });
});
