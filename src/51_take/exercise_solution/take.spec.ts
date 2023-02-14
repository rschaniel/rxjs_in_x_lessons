import { createTestScheduler } from '../../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('take', () => {

    it('unsubscribes', () => {
        createTestScheduler().run((helpers) => {
            const { cold, expectObservable, expectSubscriptions } = helpers;

            const source$ = cold('0123456789');
            const result$ = source$.pipe(
                take(3)
            );

            expectObservable(result$).toBe(
                'ab(c|)',
                { a: '0', b: '1', c: '2' }
            );
            expectSubscriptions(source$.subscriptions).toBe('^-!')
        });
    });
});
