import { of, GroupedObservable, Observable, fromEvent, interval } from 'rxjs';
import { map, mergeScan, take } from 'rxjs/operators';


describe('mergeScan', () => {

    interface Page {
        content: string;
        next: number;
    }

    interface TotalContent {
        content: string;
        loaded: number;
    }

    const paginatedHttpService = {
        getPage: (page: number): Observable<Page> => of({content: `Lorem ipsum on page ${page}`, next: page + 1})
    };

    it('infinite content loading', (done) => {
        const click$ = interval(1000).pipe(take(3));

        const result$ = click$.pipe(
            mergeScan((acc, cur) => paginatedHttpService.getPage(acc.loaded + 1)
                .pipe(
                    map((newPage) => ({ content: acc.content.concat(' ' + newPage.content), loaded: acc.loaded + 1 }))
                ), {
                content: '',
                loaded: 0,
            })
        );

        result$.subscribe({
            next: console.log,
            complete: () => done(),
        });
    });
});
