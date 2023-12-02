import { createTestScheduler } from '../misc/test_scheduler';
import { catchError, map } from 'rxjs/operators';
import { of } from 'rxjs';


describe('catchError', () => {

    it('catches errors', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('abc#def').pipe(
                catchError(_ => of('Error thrown')),
            );

            expectObservable(source$).toBe(
                'abc(z|)',
                { a: 'a', b: 'b', c: 'c', z: 'Error thrown' });
        });
    });

    it('multiple catchError', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('abc#def').pipe(
                catchError(_ => cold('d#')),
                catchError(_ => of('Error caught again')),
            );

            expectObservable(source$).toBe(
                'abcd(z|)',
                { a: 'a', b: 'b', c: 'c', d: 'd', z: 'Error caught again' });
        });
    });

    it('falls through', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('abc#def').pipe(
                map(v => v + '-'),
                catchError(_ => of('Error caught')),
            );

            expectObservable(source$).toBe(
                'abc(z|)',
                { a: 'a-', b: 'b-', c: 'c-', z: 'Error caught' });
        });
    });

    it('replacement observable', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('#r', { r: [1, 2, 3]}).pipe(
                catchError(_ => of([])),
            );

            expectObservable(source$).toBe(
                '(d|)',
                { d: [] }
            );
        });
    });

    it('catch and rethrow', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('-#', undefined, new Error('HTTP 404')).pipe(
                catchError((err: Error, caught) => {
                    console.log('Error happened: ' + err.message);
                    if (err.message === 'HTTP 404') {
                        throw new Error('Resource not found');
                    }
                    throw new Error('General error');
                }),
            );

            expectObservable(source$).toBe(
                '-#', undefined, new Error('Resource not found')
            );
        });
    });
});
