import { of, Observable, throwError, asyncScheduler, EMPTY, BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { expand, take } from 'rxjs/operators';


describe('expand', () => {

    it('should the powers of 2 10 times', () => {
        const result$ = of(2).pipe(
            expand(x => of(x * 2)),
            take(10),
        );

        result$.subscribe(console.log);
        // 2
        // 4
        // 8
        // ...
        // 1024
    });

    it('should the powers of 2 until EMPTY is supplied', () => {
        const result$ = of(2).pipe(
            expand(x => x === 1024 ? EMPTY : of(x * 2)),
        );

        result$.subscribe(console.log);
        // 2
        // 4
        // 8
        // ...
        // 1024
    });

    it('should recursively check the next page', () => {
        interface Page {
            content: string;
            next: number;
        }

        const paginatedHttpService = {
            getPage: (page: number): Observable<Page> => of({content: `Lorem ipsum on page ${page}`, next: page + 1})
        };

        paginatedHttpService.getPage(1).pipe(
            expand(response => response.next ? paginatedHttpService.getPage(response.next) : EMPTY),
            take(3),
        ).subscribe({
            next: (v) => console.log(`${v.content}`),
            complete: () => console.log('all pages or max 3 pages returned'),
        });
        // Lorem ipsum on page 1
        // Lorem ipsum on page 2
        // Lorem ipsum on page 3
        // all pages or max 3 pages returned
    })
});
