import { createTestScheduler } from '../../misc/test_scheduler';
import { exhaustAll, map } from 'rxjs/operators';
import { Observable } from 'rxjs';


describe('exhaustAll', () => {

    it('makes sure not too many requests run in parallel', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const callService = (increase): Observable<string> => cold('99ms a|', { a: 'increased by ' + increase });

            const source$ = cold('5 50ms 2 30ms 3 50ms 8|').pipe(
                map(v => callService(v)),
            );
            const result$ = source$.pipe(exhaustAll());

            expectObservable(result$).toBe(
                '99ms a 132ms d|',
                { a: 'increased by 5', d: 'increased by 8' }
            );
        });
    });
});
