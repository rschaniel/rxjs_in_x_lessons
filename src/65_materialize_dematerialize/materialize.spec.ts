import { createTestScheduler } from '../misc/test_scheduler';
import { dematerialize, materialize } from 'rxjs/operators';
import { Notification } from 'rxjs';


describe('materialize', () => {

    it('with complete', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('ab|').pipe(
                materialize(),
            );

            expectObservable(source$).toBe(
                'ab(c|)', {
                    a: new Notification('N', 'a'),
                    b: new Notification('N', 'b'),
                    c: new Notification('C'),
                }
            );
        });
    });

    it('with error', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('ab#').pipe(
                materialize(),
            );

            expectObservable(source$).toBe(
                'ab(c|)', {
                    a: new Notification('N', 'a'),
                    b: new Notification('N', 'b'),
                    c: new Notification('E', undefined, 'error'),
                }
            );
        });
    });

    it('dematerialized', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('ab|').pipe(
                materialize(),
                dematerialize(),
            );

            expectObservable(source$).toBe(
                'ab|'
            );
        });
    });
});
