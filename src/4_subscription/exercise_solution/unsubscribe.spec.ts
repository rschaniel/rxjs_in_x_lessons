import { testScheduler } from '../../misc/test_scheduler';
import { take } from 'rxjs/operators';

describe('unsubscribe', () => {

    it('should not unsubscribe if take wants more values', () => {

        testScheduler.run((helpers) => {
            const { expectSubscriptions, hot } = helpers;
            let myService = {
                data: () => hot('-a-b-c-d', { a: 1, b: 2, c: 3, d: 4}),
            };

            const observable = myService.data();
            observable.pipe(take(5)).subscribe();
            const sub = '^------------';

            expectSubscriptions(observable.subscriptions).toBe([sub]);
        });
    });

});