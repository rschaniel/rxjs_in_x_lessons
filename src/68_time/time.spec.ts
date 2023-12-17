import { createTestScheduler } from '../misc/test_scheduler';
import { timeInterval, take, map, timestamp, timeout } from 'rxjs/operators';
import { interval, TimeInterval, TimeoutError, throwError } from 'rxjs';


describe('time', () => {

    describe('timeInterval', () => {
        it('timeInterval counts the time since the previous emission', (done) => {
            interval(1000)
                .pipe(take(4), timeInterval())
                .subscribe({ next: x => console.log(x), complete: done});

            // TimeInterval { value: 0, interval: 1004 }
            // TimeInterval { value: 1, interval: 1047 }
            // TimeInterval { value: 2, interval: 1010 }
            // TimeInterval { value: 3, interval: 1006 }
        });

        it('works with marbles', () => {
            createTestScheduler().run((helpers) => {
                const { expectObservable, cold } = helpers;

                const timeMeasured$ = cold('100ms a 200ms b 300ms c 400ms |').pipe(
                    timeInterval(),
                    map((v: TimeInterval<string>) => v.interval),
                );

                expectObservable(timeMeasured$).toBe(
                    '100ms a 200ms b 300ms c 400ms |',
                    {
                        a: 100,
                        b: 201,
                        c: 301,
                    }
                );
            });
        })
    });

    describe('timeStamp', () => {
        it('adds the time of emission', (done) => {
            interval(1000)
                .pipe(take(4), timestamp())
                .subscribe({ next: x => console.log(x), complete: done});

            // { value: 1, timestamp: 1702807174323 }
            // { value: 2, timestamp: 1702807175327 }
            // { value: 3, timestamp: 1702807176335 }
        });

        it('works with marbles', () => {
            createTestScheduler().run((helpers) => {
                const { expectObservable, cold } = helpers;

                const timeStamped$ = cold('100ms a 200ms b 300ms c 400ms |').pipe(
                    timestamp(),
                );

                expectObservable(timeStamped$).toBe(
                    '100ms a 200ms b 300ms c 400ms |',
                    {
                        a: { value: 'a', timestamp: 100 },
                        b: { value: 'b', timestamp: 301 },
                        c: { value: 'c', timestamp: 602 },
                    }
                );
            });
        })
    });

    describe('timeout', () => {
        it('works with marbles', () => {
            createTestScheduler().run((helpers) => {
                const { expectObservable, cold } = helpers;

                const timeout$ = cold('100ms a 200ms b 300ms c 400ms |').pipe(
                    timeout(250),
                );

                expectObservable(timeout$).toBe(
                    '100ms a 200ms b 249ms #',
                    {
                        a: 'a',
                        b: 'b',
                    },
                    new TimeoutError(),
                );
            });
        })

        it('specifies how to timeout', () => {
            class CustomTimeoutError extends Error {
                constructor() {
                    super('It was too slow');
                    this.name = 'CustomTimeoutError';
                }
            }

            createTestScheduler().run((helpers) => {
                const { expectObservable, cold } = helpers;

                const timeout$ = cold('100ms a 200ms b 300ms c 400ms |').pipe(
                    timeout({
                        each: 250,
                        with: () => throwError(() => new CustomTimeoutError())
                    }),
                );

                expectObservable(timeout$).toBe(
                    '100ms a 200ms b 249ms #',
                    {
                        a: 'a',
                        b: 'b',
                    },
                    new CustomTimeoutError(),
                );
            });
        })
    });

});
