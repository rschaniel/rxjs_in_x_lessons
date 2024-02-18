import { createTestScheduler } from '../misc/test_scheduler';
import { max, min } from 'rxjs/operators';


describe('max', () => {

    it('counts emissions', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('8923402|').pipe(
                max()
            );

            expectObservable(result$).toBe(
                '-------(r|)', { r: '9' }
            );
        });
    });
});

describe('min', () => {

    it('emits the lowest number', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('8923402|').pipe(
                min()
            );

            expectObservable(result$).toBe(
                '-------(r|)', { r: '0' }
            );
        });
    });

    it('accepts a comparator', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            type product = { name: string, price: number }
            const result$ = cold<product>('abc|',
                {
                    a: { name: 'Book', price: 10 },
                    b: { name: 'Video', price: 15 },
                    c: { name: 'Course', price: 20 },
                }).pipe(
                min((a, b) => a.price < b.price ? -1 : 1)
            );

            expectObservable(result$).toBe(
                '---(r|)', { r: { name: 'Book', price: 10 } }
            );
        });
    });

});
