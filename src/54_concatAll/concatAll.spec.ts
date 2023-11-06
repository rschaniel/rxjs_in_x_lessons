import { createTestScheduler } from '../misc/test_scheduler';
import { concatAll } from 'rxjs/operators';
import { of } from 'rxjs';


describe('concatAll', () => {

    it('handles inner observables in sequence', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = of(
                cold('--aa|', { a: 'a' }),
                cold('bb|', { b: 'b' })
            );
            const result$ = source$.pipe(concatAll());

            expectObservable(result$).toBe(
                '--aabb|',
                { a: 'a', b: 'b' }
            );
        });
    });

    it('stops on error', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = of(
                cold('--aa#', { a: 'a' }),
                cold('bb|', { b: 'b' })
            );
            const result$ = source$.pipe(concatAll());

            expectObservable(result$).toBe(
                '--aa#',
                { a: 'a', b: 'b' }
            );
        });
    });
});
