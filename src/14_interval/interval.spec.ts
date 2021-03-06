import { of, Observable, interval } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('interval', () => {

    it('should emit every millisecond', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const numbers$ = interval(1).pipe(take(5));

            expectObservable(numbers$).toBe('-0123(4|)', {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4});
        });
    });
});
