import { Subject, Subscription } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';

const testScheduler = new TestScheduler((actual, expected) => {
    expect(actual).toEqual(expected);
});

describe('marbles testing', () => {
    it('should emit 1 and 2 to the first observer and only 2 to the second', () => {
       testScheduler.run((helpers) => {
           const { cold, hot, expectObservable } = helpers;

           const subject$: Subject<number> = hot('-ab--', {a: 1, b: 2});

           expectObservable(subject$, '^----').toEqual(cold('-xy', {x: 1, y: 2}));
           expectObservable(subject$, '--^--').toEqual(cold('y', {y: 2}));
       });
    });
});
