import { of, interval } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { testScheduler } from '../misc/test_scheduler';


describe('filter', () => {

    it('should only forward even numbers', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = interval(1).pipe(
                take(6),
                filter(n => n % 2 === 0),
            );

            expectObservable(result$).toBe('-a-b-c|', { a: 0, b: 2, c: 4 });
        });
    });

    it('should filter by BooleanConstructor', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of(1, 2, undefined, 3, null, '', 4, 'other string', {}).pipe(
                filter(Boolean),
            );

            expectObservable(result$).toBe(
                '(abcdef|)',
                { a: 1, b: 2, c: 3, d: 4, e: 'other string', f: {} }
            );
        });
    });

    it('should filter by type', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of(1, undefined, 2, '', 4, 'other string', {}).pipe(
                filter((v: any): v is string => typeof v === 'string'),
            );

            expectObservable(result$).toBe(
                '(ab|)',
                { a: '', b: 'other string' }
            );
        });
    });
});
