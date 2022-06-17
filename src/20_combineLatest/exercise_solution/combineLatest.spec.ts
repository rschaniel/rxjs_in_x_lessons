import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { testScheduler } from '../../misc/test_scheduler';
import { combineLatest } from 'rxjs';
import { tap } from 'rxjs/operators';


describe('combineLatest', () => {


    it('should deal with errors', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            expectObservable(combineLatest(
                cold(        '-q----#r|'),
                cold(        'xx----y|')
            ).pipe(
                tap(console.log))
            ).toBe('-(aa)-#',
                {
                         a: ['q', 'x'],
                }
            );
        });
    });
});
