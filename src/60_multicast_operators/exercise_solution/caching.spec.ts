import { mergeMap, mergeWith, shareReplay, first, map, tap } from 'rxjs/operators';
import { Observable, of, defer, isObservable } from 'rxjs';


describe('caching', () => {

    it('multicast with delayed reset', (done) => {
        let shared$: Observable<string>;
        let version = 1;

        const createShared = (obs: Observable<string>) =>
            (shared$ = obs.pipe(
                map(r => r + " v" + version),
                tap(_ => version++),
                shareReplay(1, 10_000),
            ));

        const createRefetchable = (obs: Observable<string>) => createShared(obs).pipe(
            first(null, defer(() => createShared(obs))),
            mergeMap(d => (isObservable(d) ? d : of(d)))
        );

        const cachedRefetchableSource$ = createRefetchable(of('response'));

        cachedRefetchableSource$.subscribe({ next: r => console.log('subscriber 1 got: ' + r)});

        setTimeout(() => {
            cachedRefetchableSource$.subscribe({ next: r => console.log('subscriber 2 got: ' + r)});
        }, 5_000);


        setTimeout(() => {
            cachedRefetchableSource$.subscribe({ next: r => console.log('subscriber 3 got: ' + r), complete: done});
        }, 15_000);
    });
});
