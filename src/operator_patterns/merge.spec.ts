import { createTestScheduler } from '../misc/test_scheduler';
import { mergeAll, map } from 'rxjs/operators';
import { of  } from 'rxjs';


describe('merge', () => {

    const mapToIndexedString = () => {
        return map((v, i) => `${v}${i + 1}`);
    };

    it('mergeAll', () => {
        createTestScheduler().run((helpers) => {
            const { cold } = helpers;
            
            const source$ = of(
                cold('-aaa|').pipe(mapToIndexedString()),
                cold('-bbb|').pipe(mapToIndexedString()),
                cold('-ccc|').pipe(mapToIndexedString()),
            );
            const result$ = source$.pipe(mergeAll());

            result$.subscribe({ next: console.log });
        });
    });
});
