import { createTestScheduler } from '../misc/test_scheduler';
import { tap, map } from 'rxjs/operators';
import { from, Subject } from 'rxjs';


describe('tap', () => {

    it('does side effects', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const source$ = from([1, 2, 3]).pipe(
                map(v => v * 2),
                tap(console.log),
                map(v => v * 2),
            );

            expectObservable(source$).toBe(
                '(abc|)', { a: 4, b: 8, c: 12 }
            );
        });
    });

    it('can connect to a subject', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const subject$ = new Subject();
            subject$.subscribe({
                next: (v) => console.log(`subject got the value: ${v}`),
                complete: () => console.log('subject saw the completion'),
            });

            const source$ = from([1, 2, 3]).pipe(
                map(v => v * 2),
                tap(subject$),
            );

            expectObservable(source$).toBe(
                '(abc|)', { a: 2, b: 4, c: 6 }
            );
        });
    });

    it('can throw an error', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const source$ = from([1, 2, 3]).pipe(
                map(v => v * 2),
                tap(v => {
                    if (v === 6) {
                        throw 'error in the side effect';
                    }
                }),
                map(v => v * 2),
            );

            expectObservable(source$).toBe(
                '(ab#)',
                { a: 4, b: 8 },
                'error in the side effect'
            );
        });
    });
});
