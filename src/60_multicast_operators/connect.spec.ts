import { Observable, merge } from 'rxjs';
import { connect, map, filter } from 'rxjs/operators';


describe('connect', () => {

    it('multicast to 3', () => {
        const heavyAsyncTask = (input: number): number => {
            console.log('heavy async task triggered');
            return input;
        };

        const observable$ = new Observable<number>((subscriber) => {
            subscriber.next(heavyAsyncTask(1));
            subscriber.next(heavyAsyncTask(2));
            subscriber.next(heavyAsyncTask(3));
        });

        observable$.pipe(
            connect(shared$ => merge(
                shared$.pipe(map(n => `all ${ n }`)),
                shared$.pipe(filter(n => n % 2 === 0), map(n => `even ${ n }`)),
                shared$.pipe(filter(n => n % 2 === 1), map(n => `odd ${ n }`))
            ))
        ).subscribe(console.log);
    });

    it('', () => {

    });
});
