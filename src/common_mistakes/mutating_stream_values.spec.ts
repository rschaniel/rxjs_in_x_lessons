import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

interface Item {
    id: number;
    name: string;
    price: number;
}


describe('mutating stream values', () => {

    it('bad example', () => {
        const fetchItems: () => Observable<Item[]> = () => of([
            { id: 1, name: 'Book', price: 20 },
            { id: 1, name: 'Pencil', price: 10 },
            { id: 1, name: 'Paper', price: 4 }
        ]);

        const $items = fetchItems();

        // with 50% discount
        $items.pipe(
            map(items => {
                items.forEach(item => item.price = item.price * 0.5)
                return items;
            })
        ).subscribe(console.log);

        // with only 10% discount
        $items.pipe(
            map(items => {
                items.forEach(item => item.price = item.price * 0.9)
                return items;
            })
        ).subscribe(console.log);
    });

    it('with immutablility', () => {
        const fetchItems: () => Observable<Item[]> = () => of([
            { id: 1, name: 'Book', price: 20 },
            { id: 1, name: 'Pencil', price: 10 },
            { id: 1, name: 'Paper', price: 4 }
        ]);

        const $items = fetchItems();

        // with 50% discount
        $items.pipe(
            map((items: Item[]) => items.map(item => ({ ...item, price: item.price * 0.5 }))),
        ).subscribe(console.log);

        // with only 10% discount
        $items.pipe(
            map((items: Item[]) => items.map(item => ({ ...item, price: item.price * 0.9 }))),
        ).subscribe(console.log);
    });
});
