import { createTestScheduler } from '../../misc/test_scheduler';
import { scan, last } from 'rxjs/operators';


describe('reduce', () => {

    it('sums up the values', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('8923402|').pipe(
                scan((a, b) => Number(a) + Number(b), 0),
                last(),
            );

            expectObservable(result$).toBe(
                '-------(r|)', { r: 28 }
            );
        });
    });
});
