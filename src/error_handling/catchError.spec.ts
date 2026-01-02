import { createTestScheduler } from '../misc/test_scheduler';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';


describe('catchError', () => {

    it('falls through', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('abc#def').pipe(
                map(v => v + '-'),
                map(v => v + '1'),
                catchError(_ => of('Error caught')),
            );

            expectObservable(source$).toBe(
                'abc(z|)',
                { a: 'a-1', b: 'b-1', c: 'c-1', z: 'Error caught' });
        });
    });
});
