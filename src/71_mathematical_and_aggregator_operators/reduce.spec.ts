import { createTestScheduler } from '../misc/test_scheduler';
import { reduce } from 'rxjs/operators';


describe('reduce', () => {

    it('sums up the values', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('8923402|').pipe(
                reduce((a, b) => Number(a) + Number(b), 0)
            );

            expectObservable(result$).toBe(
                '-------(r|)', { r: 28 }
            );
        });
    });
});
