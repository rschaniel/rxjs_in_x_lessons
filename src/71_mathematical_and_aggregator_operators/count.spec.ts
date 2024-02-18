import { createTestScheduler } from '../misc/test_scheduler';
import { count } from 'rxjs/operators';


describe('count', () => {

    it('counts emissions', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold('abc|').pipe(
                count()
            );

            expectObservable(result$).toBe(
                '---(d|)', { d: 3 }
            );
        });
    });

    it('counts with a condition', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('1234|').pipe(
                count(v => v > 2)
            );

            expectObservable(result$).toBe(
                '----(d|)', { d: 2 }
            );
        });
    });

    it('counts zero', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold('---|').pipe(
                count()
            );

            expectObservable(result$).toBe(
                '---(d|)',
                {
                    d: 0,
                }
            );
        });
    });
});
