import { of, Observable, fromEvent, NEVER, timer } from 'rxjs';
import { testScheduler } from '../misc/test_scheduler';
import { mapTo, take, concat } from 'rxjs/operators';


describe('fromEvent and fromEventPattern', () => {

    it('should create from an event', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const clicks$ = fromEvent(document, 'click');
            // or more exact:
            const clickEventsOnDocument$: Observable<MouseEvent> = fromEvent<MouseEvent>(document, 'click');
        });
    });

    it('should create from an event with options', () => {
        testScheduler.run((helpers) => {
            const clicks$ = fromEvent(document, 'click', { once: true });
        });
    });

    it('should test by mocking the target', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            const target = {
                addEventListener: (eventType: any, listener: any) => {
                    timer(5, 2, testScheduler)
                        .pipe(
                            mapTo('event'),
                            take(2),
                            concat(NEVER)
                        )
                        .subscribe(listener);
                },
                removeEventListener: (): void => void 0,
                dispatchEvent: (): void => void 0,
            };
            const e1 = fromEvent(target as any, 'click');
            const expected = '-----x-x---';
            expectObservable(e1).toBe(expected, {x: 'event'});
        });
    });
});
