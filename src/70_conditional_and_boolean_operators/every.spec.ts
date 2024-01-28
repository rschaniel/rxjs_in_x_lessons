import { createTestScheduler } from '../misc/test_scheduler';
import { every } from 'rxjs/operators';


describe('every', () => {

    it('emits false and completes if condition violated', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('24678|').pipe(
                every(v => v % 2 === 0)
            );

            expectObservable(result$).toBe(
                '---(f|)',
                {
                    f: false,
                }
            );
        });
    });

    it('emits true and completes if all values pass', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('2468|').pipe(
                every(v => v % 2 === 0)
            );

            expectObservable(result$).toBe(
                '----(t|)',
                {
                    t: true,
                }
            );
        });
    });
});
