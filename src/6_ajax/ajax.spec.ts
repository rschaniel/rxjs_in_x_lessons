import { ajax } from 'rxjs/ajax';
import { catchError, map } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';

interface GitHubUser {
    id: number;
}

describe('ajax', () => {

    it('should create an Observable for a GET request', (done) => {
        const githubUsers$ = ajax(`https://api.github.com/users?per_page=5`);

        githubUsers$
            .pipe(map(result => result.response))
            .subscribe(response => {
                console.log(response);
                done();
            });
    });

    it('should create an Observable for a GET request that returns a 404', (done) => {
        const githubUsers$ = ajax(`https://api.github.com/usders?per_page=5`);

        githubUsers$
            .pipe(map(result => result.response))
            .subscribe(response => {
                console.log(response);
                done();
            }, error => {
                console.log('An error occurred');
                console.log(error);
                done();
            });
    });

    it('should create an Observable for a GET json request', (done) => {
        const githubUsers$: Observable<GitHubUser[]> =
            ajax.getJSON<GitHubUser[]>(`https://api.github.com/users?per_page=5`);

        githubUsers$
            .subscribe({
                next: (responseBody) => {
                    console.log(responseBody[0].id);
                    done();
                }
            });
    });

    class GitHubService {
        getUsers$(): Observable<GitHubUser[]> {
           return ajax.getJSON<GitHubUser[]>(`https://api.github.com/users?per_page=5`);
        }
    }

    it('should mock the service', () => {
        testScheduler.run((helpers) => {
           const { cold, expectObservable } = helpers;

           const service = new GitHubService();

           // some mocking approach:
           service.getUsers$ = (): Observable<GitHubUser[]> => cold('-a', { a: [{ id: 1 }]});

           const firstUser$ = service.getUsers$().pipe(map(r => r[0]));
           expectObservable(firstUser$, '^----').toEqual(cold('-a', { a: { id: 1 }}));
        });
    });

it('should return an error', () => {
    testScheduler.run((helpers) => {
        const { cold, expectObservable } = helpers;

        const service = new GitHubService();

        // some mocking approach:
        service.getUsers$ = (): Observable<GitHubUser[]> => cold('---#', undefined, new Error('Unauthorized'));

        const firstUser$ = service.getUsers$()
            .pipe(catchError((error: Error) =>
                throwError(() => new Error(`Request failed. Message: ${error.message}`)))
            );
        expectObservable(firstUser$).toBe('---#', null, new Error('Request failed. Message: Unauthorized'));
    });
});
});
