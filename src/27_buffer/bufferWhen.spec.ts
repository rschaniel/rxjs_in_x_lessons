import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { bufferWhen } from 'rxjs/operators';


describe('bufferWhen', () => {

    it('emits when the closingSelector emits', () => {
        testScheduler.run((helpers) => {
            const { cold } = helpers;

            const events$ = cold('123456|');
            const closingSelector$ = cold('---a');
            const buffered$ = events$.pipe(bufferWhen(() => closingSelector$));

            buffered$.subscribe(console.log);
            // [1,2,3]
            // [4,5,6]
        });
    });
});
