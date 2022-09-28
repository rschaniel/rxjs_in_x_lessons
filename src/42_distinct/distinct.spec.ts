import { of, interval, Observable, zip } from 'rxjs';
import { distinct, distinctUntilChanged, distinctUntilKeyChanged } from 'rxjs/operators';


describe('distinct', () => {

    it('should ignore duplicates', () => {
        of(1, 1, 2, 3, 1, 2, 3, 4, 3, 2, 1).pipe(
            distinct()
        ).subscribe({ next: console.log });

        // 1
        // 2
        // 3
        // 4
    });

    it('should use a keySelector', () => {
        of(
            { age: 4, name: 'Kid 2'},
            { age: 7, name: 'Kid 3'},
            { age: 5, name: 'Kid 1'},
            { age: 60, name: 'Adult 1'},
            { age: 25, name: 'Adult 2'},
            { age: 18, name: 'Adult 3'},
        ).pipe(
            distinct(({ age }) => age - 17 > 0)
        ).subscribe({ next: console.log });
    });

    it('should flush occasionally', (done) => {
        zip(
            of(1, 1, 2, 3, 1, 2, 3, 4, 3, 2, 1),
            interval(500),
            (v, frequency) => v,
        )
        .pipe(
            distinct(v => v, interval(3000))
        ).subscribe({
            next: console.log,
            complete: done
        });
        // 1
        // 2
        // 3
        // 2
        // 3
        // 4
        // 1
    });
});

describe('distinctUntilChanged', () => {
   it('should be distinct on subsequent values', () => {
        of(1, 1, 1, 2, 2, 2, 1, 1, 3, 3).pipe(
           distinctUntilChanged()
        ).subscribe(console.log);

        // 1
        // 2
        // 1
        // 3
   });

   it('should use the default comparator with ===', () => {
        const obj = { name: 'Joe' };
        const obj2 = { name: 'Roger' };
        const obj3 = { name: 'Emma' };
        const obj4 = { name: 'Joe' };

        of(obj, obj, obj2, obj2, obj3, obj, obj4).pipe(
           distinctUntilChanged()
        ).subscribe(console.log);
   });
});
describe('distinctUntilChangedKey', () => {
   it('should use the default comparator with ===', () => {
        const obj = { name: 'Joe' };
        const obj2 = { name: 'Roger' };
        const obj3 = { name: 'Emma' };
        const obj4 = { name: 'Joe' };

        of(obj, obj, obj2, obj2, obj3, obj, obj4).pipe(
            distinctUntilKeyChanged('name')
        ).subscribe(console.log);
   });
});
