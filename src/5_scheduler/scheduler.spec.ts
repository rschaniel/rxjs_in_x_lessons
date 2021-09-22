import { interval, Observable, asapScheduler, asyncScheduler, queueScheduler, animationFrameScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';
import { testScheduler } from '../misc/test_scheduler';


describe('Schedulers', () => {
    it('should test the delivery', () => {
        testScheduler.run((helpers) => {
            const { hot, expectObservable, animate } = helpers;

            let myService = {
                data: () => hot('-a-b-c-d', { a: 'a', b: 'b', c: 'c', d: 'd'}),
            };
            const sub =         '^-------!';
            const output = '     ----(ab)(cd)';
            const painting = '   ----x---x';


            const observable$ = myService.data();

            animate(painting);

            expectObservable(observable$.pipe(
                observeOn(animationFrameScheduler),
            ), sub).toBe(output);
        });
    });

    it('should deliver first', (done) => {
        asyncScheduler.schedule(() => console.log('2'));
        asapScheduler.schedule(() => console.log('1'));

        setTimeout(() => done(), 1000);
    });

    it('should use the async scheduler', (done) => {
        const observable = new Observable((observer) => {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        }).pipe(
            observeOn(asyncScheduler)
        );

        console.log('before subscribe');
        observable.subscribe({
            next(x) {
                console.log('got value ' + x)
            },
            error(err) {
                console.error('error: ' + err);
            },
            complete() {
                console.log('done');
                done();
            }
        });
        console.log('after subscribe');
    });

    it('should use the queueScheduler', (done) => {
        const observable = new Observable((observer) => {
            observer.next(1);
            observer.next(2);
            observer.next(3);
            observer.complete();
        }).pipe(
            observeOn(queueScheduler)
        );

        console.log('before subscribe');
        observable.subscribe({
            next(x) {
                console.log('got value ' + x)
            },
            error(err) {
                console.error('error: ' + err);
            },
            complete() {
                console.log('done');
                done();
            }
        });
        console.log('after subscribe');
    });
});
