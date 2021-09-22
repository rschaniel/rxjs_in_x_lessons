import { Observable, of } from 'rxjs';

interface GitHubUser {
    id: number;
}


describe('a function that returns an observable for an HTTP request', () => {

    it('should execute an http request', (done) => {
        const httpGet = function<T>(url: string): Observable<T> {
            return new Observable<T>((subscriber) => {
                const request = new XMLHttpRequest();
                request.open("GET",url);
                request.addEventListener('load', function(event) {
                    if (request.status >= 200 && request.status < 300) {
                        subscriber.next(request.responseText as unknown as T)
                    } else {
                        subscriber.error(`status: ${request.statusText}, response ${request.responseText}`);
                    }
                });
                request.send();

                return () => {
                    const DONE_STATE = 4;
                    if (request && request.readyState !== DONE_STATE) {
                        request.abort();
                    }
                }
            });
        };

        const $response = httpGet<GitHubUser[]>('https://api.github.com/users?per_page=5');

        $response.subscribe({ next: (response: GitHubUser[]) => {
            console.log(response);
            done();
        } });
    });

});
