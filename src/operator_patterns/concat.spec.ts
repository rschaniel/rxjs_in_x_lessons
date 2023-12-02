import { createTestScheduler } from '../misc/test_scheduler';
import { concatAll, map } from 'rxjs/operators';
import { combineLatestWith, of } from 'rxjs';


describe('concatenation', () => {

    const mapToIndexedString = () => {
        return map((v, i) => `${v}${i + 1}`);
    };

    it('concatAll', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = of(
                cold('-aaa|').pipe(mapToIndexedString()),
                cold('-bbb|').pipe(mapToIndexedString()),
                cold('-ccc|').pipe(mapToIndexedString()),
            );
            const result$ = source$.pipe(concatAll());

            expectObservable(result$).toBe(
                '-012-345-678|',
                ['a1', 'a2', 'a3', 'b1', 'b2', 'b3', 'c1', 'c2', 'c3']
            );
        });
    });
});
