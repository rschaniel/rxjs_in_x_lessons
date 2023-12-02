import { createTestScheduler } from '../../misc/test_scheduler';
import { catchError } from 'rxjs/operators';


describe('catchError', () => {

    it('catch and rethrow', () => {
        createTestScheduler().run((helpers) => {
            const { cold } = helpers;

            const source$ = cold('-#', undefined, new Error('HTTP 404')).pipe(
                catchError((err: Error, caught) => {
                    console.log('Error happened: ' + err.message);
                    if (err.message === 'HTTP 404') {
                        throw new Error('Resource not found');
                    }
                    throw new Error('General error');
                }),
            );

            source$.subscribe({
                error: (e) => console.error(e)
            })
        });
    });
});
