import { BehaviorSubject } from 'rxjs';

describe('BehaviourSubject', () => {

    it('should inform all subscribers (also about the last value)', () => {
        const subject$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

        subject$.subscribe({ next: (v) => console.log(`A: ${v}`)});
        subject$.next(1);
        subject$.next(2);
        subject$.subscribe({ next: (v) => console.log(`B: ${v}`)});
        subject$.next(3);

        // A: 0
        // A: 1
        // A: 2
        // B: 2
        // A: 3
        // B: 3
    });
});