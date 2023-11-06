import { createTestScheduler } from '../misc/test_scheduler';
import { switchAll } from 'rxjs/operators';


describe('switchAll', () => {

    it('switches to the newest inner Observable', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold, hot } = helpers;

            const innerA = cold('  aaaaa|', { a: 'a' });
            const innerB = cold('    bbbb|', { b: 'b' });
            const innerC = cold('      -ccc|', { c: 'c' });

            const source$ = hot('--A-B-C--|', { A: innerA, B: innerB, C: innerC });
            const result$ = source$.pipe(switchAll());

            expectObservable(result$).toBe(
                '--aabb-ccc|',
                { a: 'a', b: 'b', c: 'c' }
            );
        });
    });

    it('switches with no output', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold, hot } = helpers;

            const innerA = cold('  aaaaa|', { a: 'a' });
            const innerB = cold('    ----|', { b: 'b' });
            const innerC = cold('      -ccc|', { c: 'c' });

            const source$ = hot('--A-B-C--|', { A: innerA, B: innerB, C: innerC });
            const result$ = source$.pipe(switchAll());

            expectObservable(result$).toBe(
                '--aa---ccc|',
                { a: 'a', c: 'c' }
            );
        });
    });
});
