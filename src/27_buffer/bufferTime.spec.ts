import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { bufferTime } from 'rxjs/operators';


describe('bufferTime', () => {

    it('buffers for x millseconds', () => {
        testScheduler.run((helpers) => {
            const { cold } = helpers;

            const events$ = cold('123456789|');
            const buffered$ = events$.pipe(bufferTime(5));

            buffered$.subscribe(console.log);
            // [1,2,3,4,5]
            // [6,7,8,9]
        });
    });

    it('buffers for x millseconds with bufferCreationInterval', () => {
        testScheduler.run((helpers) => {
            const { cold } = helpers;

            const events$ = cold('123456789|');
            const buffered$ = events$.pipe(bufferTime(2, 4));

            buffered$.subscribe(console.log);
            // [1,2]
            // [5,6,7]
            // []
        });
    });

    it('buffers for x millseconds with bufferMaxSize', () => {
        testScheduler.run((helpers) => {
            const { cold } = helpers;

            const events$ = cold('123456789|');
            const buffered$ = events$.pipe(bufferTime(5, 5, 2));

            buffered$.subscribe(console.log);
            // [1,2]
            // [6,7]
        });
    });
});
