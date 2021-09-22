import { interval, Observable, range, EMPTY, EmptyError} from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { first, take } from 'rxjs/operators';


const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
});

describe('take(1) vs first', () => {
    it('take(1) emits one value and completes', () => {
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;

            const result$ = cold('-1-2-3|').pipe(
                take(1)
            );
            expectObservable(result$).toBe('-(a|)', { a: '1' });
        });
    });

    it('first emits one value and completes', () => {
        testScheduler.run((helpers) => {
            const { cold, expectObservable } = helpers;

            const result$ = cold('-1-2-3|').pipe(
                first()
            );
            expectObservable(result$).toBe('--(a|)', { a: '1' });
        });
    });

    it('first errors on EMPTY while take(1) does not', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            expectObservable(EMPTY.pipe(
                first())
            ).toBe('#', undefined, new EmptyError());

            expectObservable(EMPTY.pipe(
                take(1)
            )).toBe('|');
        });
    });
});
