import { of, GroupedObservable, Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';


describe('map', () => {

    const mapper = {
      mulitplicator: 3,
      map(v) {
          return v * this.mulitplicator;
      }
    };

    it('should map', () => {
        const result$: Observable<number> = of(1,2,3,4).pipe(
            map(mapper.map, mapper),
        );

        result$.subscribe((v) => console.info(v));
        // 2
        // 4
        // 6
        // 8
    });
});
