import { AsyncSubject } from 'rxjs';

describe('AsyncSubject', () => {

    it('should inform the subscriber only with the last value before completion', () => {
        const subject$: AsyncSubject<number> = new AsyncSubject<number>();

        subject$.subscribe({ next: (v) => console.log(`A: ${v}`)});
        subject$.next(1);
        subject$.next(2);
        subject$.subscribe({ next: (v) => console.log(`B: ${v}`)});
        subject$.next(3);
        subject$.complete();

        // A: 3
        // B: 3
    });
});