import { createTestScheduler, testScheduler } from '../misc/test_scheduler';
import { delay, take } from 'rxjs/operators';
import { interval } from 'rxjs';


describe('delay', () => {

    it('delays the emission', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const source$ = interval(1).pipe(
                take(4),
                delay(2),
            );

            expectObservable(source$).toBe(
                '---abc(d|)', { a: 0, b: 1, c: 2, d: 3 }
            );
        });
    });

    it('previous example without delay', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const source$ = interval(1).pipe(
                take(4),
            );

            expectObservable(source$).toBe(
                '-abc(d|)', { a: 0, b: 1, c: 2, d: 3 }
            );
        });
    });

    it('delay until a certain date', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, time, cold } = helpers;

            const t = time('---|');
            const delayedUntil = new Date(testScheduler.now() + t);

            const source$ = cold('-a|').pipe(
                delay(delayedUntil)
            );

            expectObservable(source$).toBe(
                '---(a|)'
            );
        });
    });
});
