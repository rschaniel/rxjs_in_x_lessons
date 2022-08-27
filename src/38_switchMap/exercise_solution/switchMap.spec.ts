import { of, interval, Observable } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';


describe('switchMap', () => {

    const windowMethodsAndFields: string[] = [];
    for (let field in window) {
        windowMethodsAndFields.push(field.toString());
    }

    const search = (characters: string) => new Observable(observer => {
        const SEARCH_REQUEST_DELAY = 1000;
        const result = windowMethodsAndFields.filter(field => field.includes(characters));

        setTimeout(() => {
            observer.next(result);
            observer.complete();
        }, SEARCH_REQUEST_DELAY);
    });

    it('should search', (done) => {
        of('state', 'load').pipe(
            filter(input => input.length > 2),
            switchMap(input => search(input)),
        ).subscribe({
            next: console.log,
            complete: done
        })
    });


});
