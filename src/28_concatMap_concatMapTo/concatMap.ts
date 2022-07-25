import { of, Observable, throwError, asyncScheduler } from 'rxjs';
import { BehaviorSubject, zip, interval, fromEvent } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { concatMap } from 'rxjs/operators';


describe('concatMap', () => {

    it('marbles testing', () => {
        testScheduler.run((helpers) => {
            const { expectObservable, cold } = helpers;

            const result$ = of(1,2,3).pipe(
                concatMap((v: number) => v * 2)
            );
        });
    });
});
