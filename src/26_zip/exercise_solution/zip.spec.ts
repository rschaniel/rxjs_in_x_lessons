import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';


describe('zip', () => {

    it('combines one value of each', () => {
        const frameworks$ = of('Angular', 'ReactJs', 'VueJs', 'AnotherSuperCoolFrameworkJS');
        const yearOfIntroduction$ = of(2010, 2013, 2014);

        const result$ = zip(
            frameworks$,
            yearOfIntroduction$,
            (framework, year) => `${framework} was introduce in ${year}`
        );

        result$.subscribe(console.log);
    });
});
