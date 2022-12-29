import { createTestScheduler } from '../misc/test_scheduler';
import { EMPTY, of, EmptyError, SequenceError } from 'rxjs';
import { single } from 'rxjs/operators';


describe('single', () => {

    it('asserts that a single value is emitted', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of('a').pipe(single());

            expectObservable(result$).toBe('(a|)');
        });
    });

    it('asserts that a single value is emitted with predicate', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const result$ = cold('abc|').pipe(single(v => v === 'b'));

            expectObservable(result$).toBe('---(b|)');
        });
    });

    it('throws a SequenceError if multiple values are emitted', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of('a', 'b').pipe(single());

            expectObservable(result$).toBe(
                '#', null,
                new SequenceError('Too many matching values')
            );
        });
    });

    it('throws an EmptyError if no value is emitted', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = EMPTY.pipe(single());

            expectObservable(result$).toBe(
                '#', null,
                new EmptyError()
            );
        });
    });
});
