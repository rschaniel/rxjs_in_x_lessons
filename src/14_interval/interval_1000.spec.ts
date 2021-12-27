import { of, Observable, interval } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('interval', () => {

    it('should emit every second', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const numbers$ = interval(1000).pipe(take(5));

            expectObservable(numbers$).toBe(
                '1s 0 999ms 1 999ms 2 999ms 3 999ms (4|)',
                {'0': 0, '1': 1, '2': 2, '3': 3, '4': 4});
        });
    });
});
