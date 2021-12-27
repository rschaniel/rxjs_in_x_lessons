import { of, Observable, interval } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('of', () => {

    it('should emit', () => {
        of(1,2,3).subscribe({ next: console.log });
    });

    it('should emit and complete', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const numbers$ = of(1,2,3);

            expectObservable(numbers$).toBe('(123|)', {'1': 1, '2': 2, '3': 3});
        });
    });

    it('should only be rarely used for testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            // numbers$ is actually something involving: interval(1).pipe(take(2));
            // but here it's 'mocked' with of
            const numbers$ = of(0,1);

            expectObservable(numbers$).toBe('-01', {'0': 0, '1': 1});
        });
    });

    it('should be replace by rxjs marbles cold observable', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            const numbers$ = cold('-0(1|)');

            expectObservable(numbers$).toBe('-0(1|)');
        });
    });
});
