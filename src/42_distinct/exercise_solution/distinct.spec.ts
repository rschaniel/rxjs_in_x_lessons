import { of, interval, Observable, zip } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';


describe('distinct', () => {

    it('should use a keySelector', () => {
        of(
            { id: 1, name: 'Book', price: 10},
            { id: 1, name: 'Great Book', price: 10},
            { id: 1, name: 'Great Book', price: 9},

            { id: 2, name: 'Pencil', price: 2},
            { id: 2, name: 'Pencil', price: 3},

            { id: 3, name: 'Shoe', price: 300},
            { id: 3, name: 'Red Shoe', price: 300},
        ).pipe(
            distinctUntilChanged((prev, curr) => prev.id === curr.id && prev.price === curr.price)
        ).subscribe({ next: console.log });
    });
});
