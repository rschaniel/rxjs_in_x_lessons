import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';


describe('hot vs. cold', () => {

    it('cold Observable made hot', (done) => {
        let numerOfValuesProduced = 0;
        const obs$ = new Observable((observer) => {
            let currentNumber = 1;
            const producer = setInterval(_ => {
                numerOfValuesProduced++;
                observer.next(currentNumber++);
            }, 1000);

            return () => clearInterval(producer)
        }).pipe(shareReplay());

        const subscription = obs$.subscribe({ next: v => console.log('1st: ' + v)});
        let subscription2;
        setTimeout(() => {
            subscription2 = obs$.subscribe({ next: v => console.log('2nd: ' + v)});
        }, 1000);

        setTimeout(_ => {
            subscription.unsubscribe();
            subscription2.unsubscribe();

            console.log(`numerOfValuesProduced: ${numerOfValuesProduced}`);
            done();
        }, 6_100);

        // 1st: 1, 1st: 2, 1st: 3, 1st: 4, 1st: 5, 1st: 6
        // 2nd: 1, 2nd: 2, 2nd: 3, 2nd: 4, 2nd: 5, 2nd: 6
    });
});
