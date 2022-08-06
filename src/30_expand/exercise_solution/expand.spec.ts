import { of, Observable, throwError, asyncScheduler, EMPTY, BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { catchError, expand, take } from 'rxjs/operators';


describe('expand', () => {

    it('should recursively retry', () => {
        const httpService= {
            get: (url: string, attempt: number) => throwError('This is an error!').pipe(
                catchError(_ => of({error: 'Error', attempt: attempt}))
            )
        };

        httpService.get('/endpoint', 1).pipe(
            expand(response => {
                if (response.error && response.attempt < 3) {
                    return httpService.get('/endpoint', response.attempt + 1);
                } else if (response.error) {
                    return throwError('Failed also after 3rd attempt');
                } else {
                    return EMPTY;
                }
            }),
        ).subscribe({
            next: (v) => console.log(v),
            error: (e) => console.log(e),
        });
    })
});
