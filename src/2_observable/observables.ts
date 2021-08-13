import { fromEvent, Observable } from 'rxjs';

const mouseEventObservable: Observable<MouseEvent> =
    fromEvent<MouseEvent>(document, 'click');

export function createMouseEventObservable(target): Observable<MouseEvent> {
    return fromEvent<MouseEvent>(target, 'click')
}