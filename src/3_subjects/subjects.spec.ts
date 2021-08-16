import { Subject } from 'rxjs';

describe('Subject', () => {

    it('should inform all subscribers', () => {
        const subject$: Subject<number> = new Subject<number>();

        const subA = subject$.subscribe({ next: (v) => console.log(`A: ${v}`)});
        subject$.next(1);
        subject$.subscribe({ next: (v) => console.log(`B: ${v}`)});
        subject$.next(2);

        subA.unsubscribe();

        subject$.subscribe({ next: (v) => console.log(`C: ${v}`)});

        subject$.next(3);
    });

});