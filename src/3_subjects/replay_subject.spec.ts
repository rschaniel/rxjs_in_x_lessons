import { ReplaySubject } from 'rxjs';

describe('ReplaySubject', () => {

    it('should inform all subscribers', () => {
        const subject$: ReplaySubject<number> = new ReplaySubject<number>(2);

        subject$.next(1);
        subject$.next(2);
        subject$.next(3);
        subject$.subscribe({next: (v) => console.log(`A: ${v}`)});
        subject$.next(4);

        // A: 2
        // A: 3
        // A: 4
    });

    it('should inform all subscribers time based', (done) => {
        const subject$: ReplaySubject<number> = new ReplaySubject<number>(10, 200);
        let value = 0;

        const interval = setInterval(() => subject$.next(value++), 100);
        setTimeout(() => {
            subject$.subscribe({next: (v) => console.log(`A: ${v}`)});
        }, 450);


        setTimeout(() => {
            clearInterval(interval);
            subject$.unsubscribe();
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