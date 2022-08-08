import { of, GroupedObservable, Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';


describe('map', () => {

    it('should map', () => {
        const result$: Observable<number> = of(1,2,3,4).pipe(
            map(v => v * 2),
        );

        result$.subscribe((v) => console.info(v));
        // 2
        // 4
        // 6
        // 8
    });

    it('should map the click', () => {
        const clicks$ = fromEvent<PointerEvent>(document, 'click');
        const positions = clicks$.pipe(map(event => ({
            x: event.clientX,
            y: event.clientY
        })));
    });
});
