import { interval, Observable } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { take } from 'rxjs/operators';

const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
});

describe('Subscription', () => {
    it('should test the subscription', () => {
        testScheduler.run((helpers) => {
            const { hot, expectSubscriptions, expectObservable } = helpers;

            const source = hot('--a-b-c-d-');
            const sub = '       ---^---!--';
            const output = '    ----b-c---';

            expectObservable(source, sub).toBe(output);
            expectSubscriptions(source.subscriptions).toBe([sub]);
        });
    });

    it('should test the subscription dependent on take', () => {

        testScheduler.run((helpers) => {
            const { expectSubscriptions, hot } = helpers;
            let myService = {
                data: () => hot('-a-b-c-d', { a: 1, b: 2, c: 3, d: 4}),
            };

            const observable = myService.data();
            observable.pipe(take(3)).subscribe();
            const sub = '^----!';

            expectSubscriptions(observable.subscriptions).toBe([sub]);
        });
    });
});
