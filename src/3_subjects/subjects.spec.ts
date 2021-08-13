import { Subject } from 'rxjs';

describe('Subject', () => {

    it('should inform all subscribers', () => {
        const distributor$: Subject<number> = new Subject<number>();

        const subA = distributor$.subscribe({ next: (v) => console.log(`A: ${v}`)});
        distributor$.next(1);
        distributor$.subscribe({ next: (v) => console.log(`B: ${v}`)});
        distributor$.next(2);

        subA.unsubscribe();

        distributor$.subscribe({ next: (v) => console.log(`C: ${v}`)});

        distributor$.next(3);
    });

});