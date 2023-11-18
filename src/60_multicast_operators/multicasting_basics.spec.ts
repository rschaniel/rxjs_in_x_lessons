import { Observable, Subject } from 'rxjs';


describe('multicasting basics', () => {

    it('operation executed for every subscriber', () => {
        const heavyAsyncTask = () => {
            console.log('heavy async task triggered');
            return 'result';
        };

        const observable = new Observable((subscriber) => {
            const result = heavyAsyncTask();
            subscriber.next(result);
        });

        observable.subscribe({ next: r => console.log('subscriber 1 got: ' + r)});
        observable.subscribe({ next: r => console.log('subscriber 2 got: ' + r)});

        // heavy async task triggered
        // subscriber 1 got: result
        // heavy async task triggered
        // subscriber 2 got: result
    });

    it('through subject', () => {
        const heavyAsyncTask = () => {
            console.log('heavy async task triggered');
            return 'result';
        };

        const observable = new Observable((subscriber) => {
            const result = heavyAsyncTask();
            subscriber.next(result);
        });

        const subject$ = new Subject();

        subject$.subscribe({ next: r => console.log('subscriber 1 got: ' + r)});
        subject$.subscribe({ next: r => console.log('subscriber 2 got: ' + r)});

        // important to subscribe after the subscriptions to subject$
        observable.subscribe(subject$);

        // heavy async task triggered
        // subscriber 1 got: result
        // subscriber 2 got: result
    });
});
