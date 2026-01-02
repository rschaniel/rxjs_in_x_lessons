import { Observable, of, throwError, interval } from 'rxjs';
import { take, switchMap, tap, map } from 'rxjs/operators';

interface Item {
    id: number;
    name: string;
    price: number;
}

interface Notification {
    text: string;
    type: 'SUCCESS' | 'ERROR';
}


jest.spyOn(global, 'setTimeout');
jest.spyOn(global, 'clearTimeout');

describe('side effects', () => {

    const callWithError = (id: number): Observable<string> => {
        if (id === 3) {
            return throwError(() => new Error('Failed to load ' + id));
        }
        return of('result' + id);
    };
    const call = (id: number): Observable<string> => {
        return of('result' + id);
    };
    let notifications: Notification[] = [];

    beforeEach(() => {
        notifications = [];
    });

    it('bad example', (done) => {
        const source$ = interval(1000);
        let timeouts: NodeJS.Timeout[] = [];

        source$.pipe(
            switchMap(id => {
                let result$ = callWithError(id);
                if (notifications.length > 2) {
                    notifications = notifications.slice(1);
                }
                notifications.push({ type: 'SUCCESS', text: `loaded ${id}`});
                let timeout = setTimeout(() => {
                    notifications = notifications.filter(n => n.text !== `loaded ${id}`);
                    console.log('removed notification for', id);
                }, 3000);
                timeouts.push(timeout);
                return result$;
            }),
            take(5),
        ).subscribe({
            next: (v) => { console.log(v); console.log(notifications); },
            error: (err) => {
                timeouts.forEach(t => clearTimeout(t));
                console.error('Error occurred:', err.message);
                expect(clearTimeout).toHaveBeenCalledTimes(4); 
                done();
            },
            complete: () => {
                timeouts.forEach(t => clearTimeout(t));
                expect(setTimeout).toHaveBeenCalledTimes(5);
                expect(clearTimeout).toHaveBeenCalledTimes(5); // was only called 0 times
                done(); 
            }
        });
    });

    it('better example with non-blocking demonstration', (done) => {
        const source$ = interval(1000);

        source$.pipe(
            switchMap(id => call(id).pipe(
                map(result => [result, id]),
            )),
            tap(([_result, id]) => {
                let timeout = setTimeout(() => {
                    console.log('waited 3s for ', id);
                }, 3000);
                if (notifications.length > 2) {
                    notifications = notifications.slice(1);
                }
                notifications.push({ type: 'SUCCESS', text: `loaded ${id}`});
            }),
            tap(([_result, id]) => console.log('got result already for ', id)),
            map(([result, _id]) => result),
            take(5),
        ).subscribe({
            next: (v) => { console.log(v); console.log(notifications); },
            complete: done,
        });
    });

    it('better example', (done) => {
        const source$ = interval(1000);

        source$.pipe(
            switchMap(id => call(id).pipe(
                map(result => [result, id]),
            )),
            tap(([_result, id]) => {
                if (notifications.length > 2) {
                    notifications = notifications.slice(1);
                }
                notifications.push({ type: 'SUCCESS', text: `loaded ${id}`});
            }),
            map(([result, _id]) => result),
            take(5),
        ).subscribe({
            next: (v) => { console.log(v); console.log(notifications); },
            complete: done,
        });
    });

    it('even better example', (done) => {
        const source$ = interval(1000);
        const handleNotification = (id: number) => {
            if (notifications.length > 2) {
                notifications = notifications.slice(1);
            }
            notifications.push({ type: 'SUCCESS', text: `loaded ${id}`});

        };

        source$.pipe(
            switchMap(id => call(id).pipe(
                tap(_ => handleNotification(id)),
            )),
            take(5),
        ).subscribe({
            next: (v) => { console.log(v); console.log(notifications); },
            complete: done,
        });
    });
});