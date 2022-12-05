import { of, ArgumentOutOfRangeError } from 'rxjs';
import { elementAt } from 'rxjs/operators';
import { testScheduler } from '../misc/test_scheduler';


describe('elementAt', () => {

    it('should emit a single value at the specified index', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of(0,1,2,3,4).pipe(
                elementAt(2),
            );

            expectObservable(result$).toBe('(a|)', {'a': 2});
        });
    });

    it('should emit an error', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of(0,1,2,3,4).pipe(
                elementAt(5),
            );

            expectObservable(result$).toBe('#', null, new ArgumentOutOfRangeError());
        });
    });

    it('should emit the default', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of(0,1,2,3,4).pipe(
                elementAt(5, 99),
            );

            expectObservable(result$).toBe('(a|)', { a: 99 });
        });
    });
});
