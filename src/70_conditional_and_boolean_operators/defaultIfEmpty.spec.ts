import { createTestScheduler } from '../misc/test_scheduler';
import { defaultIfEmpty } from 'rxjs/operators';


describe('defaultIfEmpty', () => {

    it('returns a default value', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold('---|').pipe(
                defaultIfEmpty(0)
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
