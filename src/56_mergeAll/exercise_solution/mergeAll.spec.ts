import { createTestScheduler } from '../../misc/test_scheduler';
import { map, mergeAll } from 'rxjs/operators';
import { Observable } from 'rxjs';


describe('mergeAll', () => {

    it('just merges the values as they occur', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const fetchNews = (source): Observable<string> => cold('99ms r|', { r: 'News from ' + source });
            const fetchAds = (type): Observable<string> => cold('10ms r|', { r: 'Ad for ' + type });

            const newsDef = { type: 'news', value: 'Source'};
            const adsDef = { type: 'ads', value: 'Product'};

            const source$ = cold('nan|', { n: newsDef, a: adsDef }).pipe(
                map(def => def.type === 'news' ? fetchNews(def.value) : fetchAds(def.value)),
            );
            const feed$ = source$.pipe(mergeAll());

            expectObservable(feed$).toBe(
                '11ms a 87ms n 1ms n|',
                { a: 'Ad for Product', n: 'News from Source' }
            );
        });
    });
});
