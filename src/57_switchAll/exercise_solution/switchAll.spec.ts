import { createTestScheduler } from '../../misc/test_scheduler';
import { switchAll } from 'rxjs/operators';
import { Observable } from 'rxjs';


describe('switchAll', () => {

    it('always fetches the latest news', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold, hot } = helpers;

            const fetchNews = (): Observable<string> => cold('--r|', { r: 'Latest news' });

            const source$ = hot('--t-t--tt---t|', {t: fetchNews()});
            const feed$ = source$.pipe(switchAll());

            expectObservable(feed$).toBe(
                '------n---n---n|',
                { n: 'Latest news' }
            );
        });
    });
});
