import { Observable, of } from 'rxjs';
import { tap, map, shareReplay } from 'rxjs/operators';


describe('recreating Observables', () => {

    it('bad example', () => {
        const fetchItems = () => of([{ id: 1, name: 'Book'}, { id: 1, name: 'Pencil'}, { id: 1, name: 'Paper'}]).pipe(
            tap(_ => console.log('expensive and slow operation triggred')),
        );

        const $items = fetchItems();
        const $itemsCount = fetchItems().pipe(map(items => items.length));

        $items.subscribe();
        $itemsCount.subscribe();
    });

    it('sharing', () => {
        const fetchItems = () => of([{ id: 1, name: 'Book'}, { id: 1, name: 'Pencil'}, { id: 1, name: 'Paper'}]).pipe(
            tap(_ => console.log('expensive and slow operation triggred')),
        );

        const $items = fetchItems().pipe(shareReplay({ bufferSize: 1, refCount: true }));
        const $itemsCount = $items.pipe(map(items => items.length));

        $items.subscribe();
        $itemsCount.subscribe();
    });
});
