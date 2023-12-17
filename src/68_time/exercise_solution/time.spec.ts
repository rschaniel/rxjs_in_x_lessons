import { createTestScheduler } from '../../misc/test_scheduler';
import { timeout } from 'rxjs/operators';


describe('time', () => {

    describe('timeout', () => {

        it('replace and speed up', () => {
            createTestScheduler().run((helpers) => {
                const { expectObservable, cold } = helpers;

                const timeout$ = cold('100ms a 200ms b 300ms c 400ms |').pipe(
                    timeout({
                        each: 250,
                        with: () => cold('c 100ms |')
                    }),
                );

                expectObservable(timeout$).toBe(
                    '100ms a 200ms b 249ms c 100ms |',
                    {
                        a: 'a',
                        b: 'b',
                        c: 'c'
                    },
                );
            });
        })
    });

});
