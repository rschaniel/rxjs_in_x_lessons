import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { map } from 'rxjs/operators';


describe('zip', () => {

    it('combines one value of each', () => {
        const frameworks$ = of('Angular', 'ReactJs', 'VueJs', 'AnotherSuperCoolFrameworkJS');
        const yearOfIntroduction$ = of(2010, 2013, 2014);

        const result$ = zip(
            frameworks$,
            yearOfIntroduction$,
        );

        result$.subscribe({ next: console.log, complete: () => console.log('complete') });
        // [ 'Angular', 2010 ]
        // [ 'ReactJs', 2013 ]
        // [ 'VueJs', 2014 ]
    });

    it('should combine mouse events', () => {
        const documentEvent = eventName =>
            fromEvent<MouseEvent>(document, eventName).pipe(
                map((e: MouseEvent) => ({ x: e.clientX, y: e.clientY }))
            );

        zip(documentEvent('mousedown'), documentEvent('mouseup')).subscribe(e =>
            console.log(JSON.stringify(e))
        );
    });

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            const frameworks$ = of('Angular', 'ReactJs', 'VueJs');

            const result$ = zip(
                frameworks$,
                cold('a 200ms b 200ms (c|)', { a: 2010, b: 2013, c: 2014}),
            );

            expectObservable(result$).toBe(
                'a 200ms b 200ms (c|)',
                { a: ['Angular', 2010], b: ['ReactJs', 2013], c: ['VueJs', 2014]}
            );

        });
    });
});
