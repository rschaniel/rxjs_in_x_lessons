import { share, tap, take } from 'rxjs/operators';
import { interval } from 'rxjs';


describe('share', () => {

    it('multicast to 2', (done) => {
        const source$ = interval(1000).pipe(
            tap(x => console.log('The heavy task calculated', x)),
            take(3),
            share(),
        );

        source$.subscribe({ next: r => console.log('subscriber 1 got: ' + r)});
        source$.subscribe({ next: r => console.log('subscriber 2 got: ' + r), complete: done});

        // The heavy task calculated  0
        // subscriber 1 got: 0
        // subscriber 2 got: 0

        // The heavy task calculated  1
        // subscriber 1 got: 1
        // subscriber 2 got: 1

        // The heavy task calculated  2
        // subscriber 1 got: 2
        // subscriber 2 got: 2
    });

    it('without share', (done) => {
        const source$ = interval(1000).pipe(
            tap(x => console.log('The heavy task calculated', x)),
            take(3),
        );

        source$.subscribe({ next: r => console.log('subscriber 1 got: ' + r)});
        source$.subscribe({ next: r => console.log('subscriber 2 got: ' + r), complete: done});


        // The heavy task calculated  0
        // subscriber 1 got: 0
        // The heavy task calculated  0
        // subscriber 2 got: 0

        // The heavy task calculated  1
        // subscriber 1 got: 1
        // The heavy task calculated  1
        // subscriber 2 got: 1

        // The heavy task calculated  2
        // subscriber 1 got: 2
        // The heavy task calculated  2
        // subscriber 2 got: 2
    });
});
