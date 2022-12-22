import { of } from 'rxjs';
import { last } from 'rxjs/operators';
import { testScheduler } from '../../misc/test_scheduler';


describe('last', () => {

    it('takes last truthy value', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const result$ = of(0, {}, 1, true, null, undefined, '', false).pipe(
                last(Boolean),
            );

            expectObservable(result$).toBe('(a|)', { a: true });
        });
    });
});
