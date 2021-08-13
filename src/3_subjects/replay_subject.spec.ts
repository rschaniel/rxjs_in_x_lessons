import { ReplaySubject } from 'rxjs';

describe('ReplaySubject', () => {

    it('should inform all subscribers', () => {
        const distributor$: ReplaySubject<number> = new ReplaySubject<number>(2);

        distributor$.next(1);
        distributor$.next(2);
        distributor$.next(3);
        distributor$.subscribe({next: (v) => console.log(`A: ${v}`)});
        distributor$.next(4);

        // A: 2
        // A: 3
        // A: 4
    });

    it('should inform all subscribers time based', (done) => {
        const distributor$: ReplaySubject<number> = new ReplaySubject<number>(10, 200);
        let value = 0;

        const interval = setInterval(() => distributor$.next(value++), 100);
        setTimeout(() => {
            distributor$.subscribe({next: (v) => console.log(`A: ${v}`)});
        }, 450);


        setTimeout(() => {
            clearInterval(interval);
            distributor$.unsubscribe();
            done();
        }, 1000)

        // A: 2
        // A: 3
        // A: 4
        // A: 5
        // A: 6
        // A: 7
    });
});