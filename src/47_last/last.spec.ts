import { interval, EmptyError } from 'rxjs';
import { createTestScheduler } from '../misc/test_scheduler';
import { last, take } from 'rxjs/operators';


describe('last', () => {

    it('delivers the last value at completion', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(4),
                last(),
            );

            expectObservable(result$).toBe('----(a|)', { a: 3 });
        });
    });

    it('delivers the last value at completion that fulfills a conditon', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(4),
                last(v => v < 2),
            );

            expectObservable(result$).toBe('----(a|)', { a: 1 });
        });
    });

    it('delivers an EmptyError if there are no values', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const result$ = cold('--|').pipe(
                last(),
            );

            expectObservable(result$).toBe('--#', null, new EmptyError());
        });
    });

    it('delivers an Error if there are no values after predicate check', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(6),
                last(v => v > 5),
            );

            expectObservable(result$).toBe('------#', null, new EmptyError());
        });
    });
});
