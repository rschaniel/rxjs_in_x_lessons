import { createTestScheduler } from '../misc/test_scheduler';
import { withLatestFrom, map, toArray, startWith } from 'rxjs/operators';
import { combineLatestWith } from 'rxjs';


describe('withLatestFrom', () => {

    it('combines the source with others', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold, hot } = helpers;

            const source$ = cold('--a--b-c----d|');
            const result$ = source$.pipe(withLatestFrom(
                hot('12345678|'),
            ));

            expectObservable(result$).toBe(
                '--a--b-c----d|',
                {
                    a: ['a', '3'],
                    b: ['b', '6'],
                    c: ['c', '8'],
                    d: ['d', '8'],
                }
            );
        });
    });

    it('combines the source with many others', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold, hot } = helpers;

            const source$ = cold('--s--s-s----s|');
            const result$ = source$.pipe(withLatestFrom(
                hot('-a--b--c'),
                hot('---xyz---'),
            ));

            expectObservable(result$).toBe(
                '-----s-t----u|',
                {
                    s: ['s', 'b', 'z'],
                    t: ['s', 'c', 'z'],
                    u: ['s', 'c', 'z'],
                }
            );
        });
    });

    it('combines the source with others and maps', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold, hot } = helpers;

            const source$ = cold('--a--b-c----d|');
            const result$ = source$.pipe(
                withLatestFrom(
                    hot('12345678|'),
                ),
                map(([s, o]) => `${s}-${o}`)
            );

            expectObservable(result$).toBe(
                '--a--b-c----d|',
                {
                    a: 'a-3',
                    b: 'b-6',
                    c: 'c-8',
                    d: 'd-8',
                }
            );
        });
    });

    it('works differently than combineLatestWith', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold, hot } = helpers;

            const source$ = cold('--a--b-c----d|');
            const result$ = source$.pipe(
                combineLatestWith(
                    hot('12345678|'),
                ),
                map(([s, o]) => `${s}-${o}`),
                toArray(),
            );

            expectObservable(result$).toBe(
                '-------------(a|)',
                {
                    a: [
                        "a-3",
                        "a-4",
                        "a-5",
                        "a-6",
                        "b-6",
                        "b-7",
                        "b-8",
                        "c-8",
                        "d-8",
                    ]
                }
            );
        });
    });
});
