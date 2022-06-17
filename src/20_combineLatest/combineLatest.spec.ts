import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';


describe('combineLatest', () => {

    it('should emit', () => {
        combineLatest(
            of(1, 2, 3),
            of('a', 'b'),
        ).subscribe({ next: console.log });
        // [ 3, 'a' ]
        // [ 3, 'b' ]
    });


    it('should emit the combined values', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            expectObservable(combineLatest(
                cold(        '-q-----r|'),
                cold(        'xx----y|')
            ).pipe(
                tap(console.log))
            ).toBe('-(aa)-bc|',
                {
                         a: ['q', 'x'],
                         b: ['q', 'y'],
                         c: ['r', 'y'],
                }
            );

            /*
            Attention:
            (ab) emits values a and b synchronously in the same frame
            and then advance virtual time by 4 frames. This is because
            '(ab)'.length === 4.
             */
        });
    });


    it('should also handle 3 inputs', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            expectObservable(combineLatest(
                cold(        'a---|'),
                cold(        '-b-x|'),
                cold(        '--c-|'),
            ).pipe(
                tap(console.log))
            ).toBe('--kl|',
                {
                         k: ['a', 'b', 'c'],
                         l: ['a', 'x', 'c'],
                }
            );

            /*
            Attention:
            (ab) emits values a and b synchronously in the same frame
            and then advance virtual time by 4 frames. This is because
            '(ab)'.length === 4.
             */
        });
    });
});
