import { createTestScheduler } from '../misc/test_scheduler';
import { toArray } from 'rxjs/operators';


describe('toArray', () => {

    it('works with marbles', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold('abcd|').pipe(
                toArray()
            );

            expectObservable(result$).toBe(
                '----(r|)',
                {
                    r: ['a', 'b', 'c', 'd'],
                }
            );
        });
    });
});
