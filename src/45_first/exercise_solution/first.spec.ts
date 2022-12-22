import { of } from 'rxjs';
import { first } from 'rxjs/operators';
import { testScheduler } from '../../misc/test_scheduler';


describe('first', () => {

    it('takes first truthy value', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of(null, undefined, '', false, 0, {}, 1, true).pipe(
                first(Boolean),
            );

            expectObservable(result$).toBe('(a|)', { a: {} });
        });
    });
});
