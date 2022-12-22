import { interval, of } from 'rxjs';
import { createTestScheduler } from '../misc/test_scheduler';
import { concatMap, ignoreElements, take } from 'rxjs/operators';


describe('ignoreElements', () => {

    it('ignores all values', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(4),
                ignoreElements(),
            );

            expectObservable(result$).toBe('----|');
        });
    });

    it('emits errors though', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of(1, 'hello', true, 2, false).pipe(
                concatMap(value => {
                    if (value === 2) {
                        throw Error('error from the source!');
                    }
                    return of(value);
                }),
                ignoreElements(),
            );

            expectObservable(result$).toBe('#', null, new Error('error from the source!'));
        });
    });
});
