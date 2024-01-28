import { createTestScheduler } from '../misc/test_scheduler';
import { isEmpty } from 'rxjs/operators';


describe('isEmpty', () => {

    it('values found', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('---123|').pipe(
                isEmpty()
            );

            expectObservable(result$).toBe(
                '---(f|)', { f: false }
            );
        });
    });

    it('empty sequence', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('----|').pipe(
                isEmpty()
            );

            expectObservable(result$).toBe(
                '----(t|)', { t: true }
            );
        });
    });
});
