import { interval, EmptyError } from 'rxjs';
import { first, take } from 'rxjs/operators';
import { createTestScheduler } from '../misc/test_scheduler';


describe('first', () => {

    it('takes first value and completes', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(6),
                first(),
            );

            expectObservable(result$).toBe('-(a|)', { a: 0 });
        });
    });

    it('takes first value that satisfies a condition', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(6),
                first(v => v % 2 === 1),
            );

            expectObservable(result$).toBe('--(a|)', { a: 1 });
        });
    });

    it('emits an EmptyError when there is no value', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(6),
                first(v => v > 5),
            );

            expectObservable(result$).toBe('------#', null, new EmptyError());
        });
    });

    it('allows to have a default', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(6),
                first(v => v > 5, 99),
            );

            expectObservable(result$).toBe('------(a|)', { a: 99 });
        });
    });
});
