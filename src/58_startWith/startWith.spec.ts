import { createTestScheduler } from '../misc/test_scheduler';
import { startWith } from 'rxjs/operators';


describe('startWith', () => {

    it('emits fixed value in the beginning', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('---r|', { r: 'response'});
            const result$ = source$.pipe(startWith('loading...'));

            expectObservable(result$).toBe(
                'l--r|',
                { l: 'loading...', r: 'response' }
            );
        });
    });

    it('validates safely', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const verifyEmail$ = cold('---r|', { r: true});
            const isValid$ = verifyEmail$.pipe(startWith(false));

            expectObservable(isValid$).toBe(
                'd--v|',
                { d: false, v: true }
            );
        });
    });
});
