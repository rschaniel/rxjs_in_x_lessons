import { createTestScheduler, testScheduler } from '../../misc/test_scheduler';
import { delay } from 'rxjs/operators';


describe('delay', () => {

    it('delay until a certain date', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, time, cold } = helpers;

            const t = time('---|');
            const delayedUntil = new Date(testScheduler.now() - t);

            const source$ = cold('-a|').pipe(
                delay(delayedUntil)
            );

            expectObservable(source$).toBe(
                '-a|'
            );
        });
    });
});
