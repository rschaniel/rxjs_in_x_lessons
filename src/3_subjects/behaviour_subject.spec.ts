import { BehaviorSubject } from 'rxjs';

describe('BehaviourSubject', () => {

    it('should inform all subscribers (also about the last value)', () => {
        const distributor$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

        distributor$.subscribe({ next: (v) => console.log(`A: ${v}`)});
        distributor$.next(1);
        distributor$.next(2);
        distributor$.subscribe({ next: (v) => console.log(`B: ${v}`)});
        distributor$.next(3);

        // A: 0
        // A: 1
        // A: 2
        // B: 2
        // A: 3
        // B: 3
    });
});