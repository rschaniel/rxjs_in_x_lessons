import { createTestScheduler } from '../misc/test_scheduler';
import { delayWhen } from 'rxjs/operators';


describe('delayWhen', () => {

    it('delay until a certain date', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('-abc|').pipe(
                delayWhen((val: string, index: number) => {
                   if (val === 'b') {
                       return cold('----t');
                   }
                   return cold('-t');
                })
            );

            expectObservable(source$).toBe(
                '--a-c-(b|)'
            );
        });
    });
});
