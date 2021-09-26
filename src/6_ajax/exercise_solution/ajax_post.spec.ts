import { ajax } from 'rxjs/ajax';
import { map } from 'rxjs/operators';
import { of, Observable, throwError } from 'rxjs';
import { testScheduler } from '../../misc/test_scheduler';

interface GitHubUser {
    id: number;
    login: string;
}
type NewGitHubUser = Omit<GitHubUser, 'id'>;

describe('ajax', () => {

    class GitHubService {
        createUser$(user: NewGitHubUser): Observable<GitHubUser> {
           return ajax<NewGitHubUser>({
               url: `https://api.github.com/users`,
               method: 'POST',
               body: {}
           }).pipe(map(response => response as unknown as GitHubUser));
        }
    }

    it('should mock the service', () => {
        testScheduler.run((helpers) => {
           const { cold, expectObservable } = helpers;

           const service = new GitHubService();

           // some mocking approach:
           service.createUser$ = (user: NewGitHubUser): Observable<GitHubUser> => cold('-a', { a: { id: 1, login: 'username' }});

           const firstUser$ = service.createUser$({login: 'username'});
           expectObservable(firstUser$, '^----').toEqual(cold('-a', { a: { id: 1, login: 'username' }}));
        });
    });
});
