import { of, Observable, defer } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';


describe('defer', () => {

    it('should create the observable lazily', () => {
        const observable$ = defer(() => of(1,2,3));
    });

    it('should have same random number for all observers if defer is skipped', () => {
        const observable$ = of(Math.floor(Math.random() * 100));

        observable$.subscribe({ next: v => console.log(v) });
        observable$.subscribe({ next: v => console.log(v) });
        observable$.subscribe({ next: v => console.log(v) });

        // output for example:
        // 89
        // 89
        // 89
    });

    it('should probably have different random number for all observers', () => {
        const observable$ = defer(() => of(Math.floor(Math.random() * 100)));

        observable$.subscribe({ next: v => console.log(v) });
        observable$.subscribe({ next: v => console.log(v) });
        observable$.subscribe({ next: v => console.log(v) });

        // output for example:
        // 44
        // 61
        // 28
    });

    it('should wrap a Promise', () => {
        const promise = fetch('http://localhost:3000/customers');

        const customers$ = defer(() => fetch('http://localhost:3000/customers'));
    });

    it('should return the current time', () => {
        const whenCreated$ = of(new Date());

        whenCreated$.subscribe({ next: v => console.log(v) });
        whenCreated$.subscribe({ next: v => console.log(v) });
        whenCreated$.subscribe({ next: v => console.log(v) });


        const whenSubscribed$ = defer(() => of(new Date()));

        whenSubscribed$.subscribe({ next: v => console.log(v) });
        whenSubscribed$.subscribe({ next: v => console.log(v) });
        whenSubscribed$.subscribe({ next: v => console.log(v) });

        // 2021-09-15T16:20:08.111Z
        // 2021-09-15T16:20:08.111Z
        // 2021-09-15T16:20:08.111Z

        // 2021-09-15T16:20:08.168Z
        // 2021-09-15T16:20:08.169Z
        // 2021-09-15T16:20:08.170Z
    });

    it('should test', () => {
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;

            const observable$ = cold('-1-2-3|');
            expectObservable(observable$).toBe('-a-b-c|', {a: '1', b: '2', c: '3'});

            const deferred$ = defer(() => cold('-1-2-3|'));
            expectObservable(deferred$).toBe('-a-b-c|', {a: '1', b: '2', c: '3'});
        });
    });
});
