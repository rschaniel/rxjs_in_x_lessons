import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';


describe('timer', () => {

    it('should emit', (done) => {
        timer(1).subscribe({ next: console.log });
    });

    it('should only emit after 10 seconds', (done) => {
        timer(10 * 1000).subscribe({ next: (x) => {
                console.log(x);
                done();
            }
        });
    });

    it('should only emit after 10 seconds by date', (done) => {
        const currentDate = new Date();
        const tenSecondsFromNow = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            currentDate.getHours(),
            currentDate.getMinutes(),
            currentDate.getSeconds() + 10
        );

        timer(tenSecondsFromNow).subscribe({ next: (x) => {
                console.log(x);
                done();
            }
        });
    });


    it('should start an interval after 500ms', (done) => {
        timer(500, 100).subscribe({ next: (x) => {
                console.log(x);
                if (x === 30) {
                    done();
                }
            }
        });
    });


    it('should emit after 200ms', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            expectObservable(timer(200)).toBe('200ms (0|)', { '0': 0 });
        });
    });


    it('should emit every 100ms and immediately', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            expectObservable(timer(0, 100)
                .pipe(take(3))
            ).toBe('0 99ms 1 99ms (2|)', { '0': 0, '1': 1, '2': 2 });
        });
    });
});
