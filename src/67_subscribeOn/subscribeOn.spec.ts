import { createTestScheduler } from '../misc/test_scheduler';
import { subscribeOn } from 'rxjs/operators';
import { of, merge, asyncScheduler } from 'rxjs';


describe('subscribeOn', () => {

    it('of as async', (done) => {
        const a$ = of(1, 2, 3).pipe(subscribeOn(asyncScheduler));
        const b$ = of(4, 5, 6);

        merge(a$, b$).subscribe({ next: x => console.log(x), complete: done});

        // 4, 5, 6
        // 1, 2, 3
    });
});
