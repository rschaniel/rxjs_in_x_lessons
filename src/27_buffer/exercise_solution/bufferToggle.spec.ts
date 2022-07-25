import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../../misc/test_scheduler';
import { bufferToggle } from 'rxjs/operators';


describe('bufferToggle', () => {

    it('opens and closes the buffer', () => {
        testScheduler.run((helpers) => {
            const { cold, hot } = helpers;

            const events$ = cold(    '123456789|');
            const openBuffer$ = cold( '--o-----');
            const closeBuffer$ = cold('-----c');
            const buffered$ = events$.pipe(bufferToggle(openBuffer$, (o) => closeBuffer$));
            
            buffered$.subscribe(console.log);
            // [3,4,5,6,7,8]
            // the cold Observable only starts when the openBuffer emits and therefore 6 values are accepted
        });
    });
});
