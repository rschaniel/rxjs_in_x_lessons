import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { bufferCount } from 'rxjs/operators';


describe('bufferCount', () => {

    it('buffers depending on the number of values', () => {
        testScheduler.run((helpers) => {
            const { cold } = helpers;

            const events$ = cold('123456789|');
            const buffered$ = events$.pipe(bufferCount(2));

            buffered$.subscribe(console.log);
            // [1,2]
            // [3,4]
            // [5,6]
            // [7,8]
            // [9]
        });
    });

    it('starts a buffer every n values and emits some twice', () => {
        testScheduler.run((helpers) => {
            const { cold } = helpers;

            const events$ = cold('123456789|');
            const buffered$ = events$.pipe(bufferCount(3, 2));

            buffered$.subscribe(console.log);
            // [1,2,3]
            // [3,4,5]
            // [5,6,7]
            // [7,8,9]
            // [9]
        });
    });

    it('starts a buffer every n values and skips some values', () => {
        testScheduler.run((helpers) => {
            const { cold } = helpers;

            const events$ = cold('123456789|');
            const buffered$ = events$.pipe(bufferCount(2, 3));

            buffered$.subscribe(console.log);
            // [1,2]
            // [4,5]
            // [7,8]
        });
    });
});
