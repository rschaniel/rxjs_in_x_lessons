import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { concatMap } from 'rxjs/operators';


describe('throwError', () => {

    it('should emit', () => {
        throwError(1).subscribe({ next: console.log });
    });


    it('should be handled in the observer', () => {
        throwError(1).subscribe({
            next: console.log,
            error: (e) => console.log('Error thrown: ' + e),
            complete: () => console.log('complete'),
        });
    });


    it('should emit with error', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            expectObservable(throwError(1)).toBe('#', null, 1);
        });
    });


    it('should emit an error without throwError', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const $error = of(1,2).pipe(
                concatMap(value => {
                    if (value === 2) {
                        throw Error('x was 2!');
                    }
                    return of(value);
                })
            );

            expectObservable($error).toBe('(1#)',{'1': 1}, new Error('x was 2!'));
        });
    });
});
