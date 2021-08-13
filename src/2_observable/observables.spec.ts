import { of, Observable, merge } from 'rxjs';
import { marbles } from 'rxjs-marbles/jest';
import { createMouseEventObservable } from './observables';


describe('Observable', () => {

    let send: any;
    const target = {
        on: (name: string, handler: Function) => {
            send = handler;
        },
        off: () => {}
    };

    it('should push no values if no clicks', marbles(m => {
        const mouseEvents$: Observable<MouseEvent> = createMouseEventObservable(target);
        mouseEvents$.subscribe();
        m.expect(mouseEvents$).toBeObservable(m.cold('-'));
    }));

    it('should test dom events using traditional event listeners', (done) => {
        document.addEventListener('click', () => done());

        const event: Event = document.createEvent("HTMLEvents");
        event.initEvent("click");
        document.dispatchEvent(event);
    });

    it('should do marble testing', marbles(m => {
        const a$ = m.hot('a', {a: 'a'});
        const b$ = m.hot('b', {b: 'b'});

        m.expect(merge(a$, b$)).toBeObservable(m.cold('(ab)', {a : 'a', b: 'b'}));
    }));

    it('should push value on click', (done) => {
        const mouseEvents$: Observable<MouseEvent> = createMouseEventObservable(target);
        mouseEvents$.subscribe(event => {
            expect(event).toEqual('testEvent');
            done();
        });
        triggerClickEvent();
    });

    function triggerClickEvent() {
        send('testEvent');
    }
});