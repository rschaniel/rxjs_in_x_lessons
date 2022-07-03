import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, forkJoin, interval } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { take } from 'rxjs/operators';


describe('forkJoin', () => {

    it('should output the last value of each input observable', () => {
        forkJoin(
            of(1,2,3),
            of('a', 'b'),
        ).subscribe(console.log);
        // [3, 'b']
    });

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const forkJoinResult$ = forkJoin(
                interval(1000).pipe(take(3)),
                of('a', 'b'),
            );

            expectObservable(forkJoinResult$).toBe(
                '3s (a|)',
                { a: [2, 'b']}
            );
        });
    });

    it('multiple requests', () => {
        forkJoin({
            post: of({ title: 'RxJs forkJoin', content: 'forkJoin is used to combine...'}),
            likes: of(99),
        }).subscribe(console.log);
        // {
        //  post: { title: 'RxJs forkJoin', content: 'forkJoin is used to combine...' },
        //  likes: 99
        // }
    });
});
