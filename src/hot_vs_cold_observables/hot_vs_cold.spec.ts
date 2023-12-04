import { Observable } from 'rxjs';
import { share } from 'rxjs/operators';


describe('hot vs. cold', () => {

    let currentNumber = 1;

    beforeEach(() => {
        currentNumber = 1;
    });

    it('producer unwrapped', (done) => {
        const producer = setInterval(() => {
            console.log(++currentNumber);
            if (currentNumber === 10) {
                done();
            }
        }, 1000);
    });

    it('produces numbers', (done) => {
        const obs$ = new Observable((observer) => {
            let currentNumber = 1;
            const producer = setInterval(_ => {
                observer.next(currentNumber++);
            }, 1000);

            return () => clearInterval(producer)
        });

        const subscription = obs$.subscribe(console.log);

        setTimeout(_ => {
            subscription.unsubscribe();
            done();
        }, 5_100);

        // 1, 2, 3, 4, 5
    });

    it('produces numbers for a second observer', (done) => {
        const obs$ = new Observable((observer) => {
            let currentNumber = 1;
            const producer = setInterval(_ => {
                observer.next(currentNumber++);
            }, 1000);

            return () => clearInterval(producer)
        });

        const subscription = obs$.subscribe({ next: v => console.log('1st: ' + v)});
        let subscription2;
        setTimeout(() => {
             subscription2 = obs$.subscribe({ next: v => console.log('2nd: ' + v)});
        }, 1000);

        setTimeout(_ => {
            subscription.unsubscribe();
            subscription2.unsubscribe();
            done();
        }, 6_100);

        // 1st: 1, 1st: 2, 1st: 3, 1st: 4, 1st: 5, 1st: 6
        // 2nd: 1, 2nd: 2, 2nd: 3, 2nd: 4, 2nd: 5
    });

    it('hot', (done) => {
        const producer = (function() {
            let currentNumber = 1;
            const consumers:  { (data: number): void; } [] = [];

            const intervalId = setInterval(_ => {
                currentNumber++;
                consumers.forEach(c => c(currentNumber));
            }, 1000);
            return {
                register: (consumer) => {
                    consumers.push(consumer);
                },
                cleanUp: () => clearInterval(intervalId)
            }
        })();

        const obs$ = new Observable((observer) => {
            producer.register((v) => observer.next(v));
        });

        const subscription = obs$.subscribe({ next: v => console.log('1st: ' + v)});
        let subscription2;
        setTimeout(() => {
            subscription2 = obs$.subscribe({ next: v => console.log('2nd: ' + v)});
        }, 2000);

        setTimeout(_ => {
            subscription.unsubscribe();
            subscription2.unsubscribe();
            producer.cleanUp();
            done();
        }, 5_100);

        // 1st: 2, 1st: 3, 2nd: 3, 1st: 4, 2nd: 4, 1st: 5, 2nd: 5, 1st: 6, 2nd: 6
    });

    it('cold Observable made hot', (done) => {
        const obs$ = new Observable((observer) => {
            let currentNumber = 1;
            const producer = setInterval(_ => {
                observer.next(currentNumber++);
            }, 1000);

            return () => clearInterval(producer)
        }).pipe(share());

        const subscription = obs$.subscribe({ next: v => console.log('1st: ' + v)});
        let subscription2;
        setTimeout(() => {
            subscription2 = obs$.subscribe({ next: v => console.log('2nd: ' + v)});
        }, 1000);

        setTimeout(_ => {
            subscription.unsubscribe();
            subscription2.unsubscribe();
            done();
        }, 6_100);

        // 1st: 1, 1st: 2, 1st: 3, 1st: 4, 1st: 5, 1st: 6
        // 2nd: 2, 2nd: 3, 2nd: 4, 2nd: 5, 2nd: 6
    });
});
