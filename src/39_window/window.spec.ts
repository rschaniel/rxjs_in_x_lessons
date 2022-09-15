import { of, interval, Observable } from 'rxjs';
import { take, window } from 'rxjs/operators';


describe('window', () => {

    it('should buffer and emit as nested Observable', (done) => {
        interval(100).pipe(
            take(5),
            window(interval(310)),
        ).subscribe({
            next: nestedObservable => nestedObservable.subscribe({
                next: console.log,
                complete: () => console.log('inner complete'),
            }),
            complete: done
        });
    });
});
