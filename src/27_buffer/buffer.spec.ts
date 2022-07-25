import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { buffer } from 'rxjs/operators';


describe('buffer', () => {

    it('emits when the notifier emits', () => {
        testScheduler.run((helpers) => {
            const { cold } = helpers;

            const events$ = cold('123456789|');
            const notifier$ = cold('--a--a--a');
            const buffered$ = events$.pipe(buffer(notifier$));

            buffered$.subscribe(console.log);
            // [1,2,3]
            // [4,5,6]
            // [7,8,9]
        });
    });

    it('can also produce empty arrays', () => {
        testScheduler.run((helpers) => {
            const { cold } = helpers;

            const events$ = cold('123---456');
            const notifier$ = cold('--a--a--a');
            const buffered$ = events$.pipe(buffer(notifier$));

            buffered$.subscribe(console.log);
            // [1,2,3]
            // []
            // [4,5,6]
        });
    });
});
