import { Observable, ReplaySubject } from 'rxjs';
import { testScheduler } from '../../misc/test_scheduler';

type ActionType = 'COPY' | 'CUT' | 'PASTE' | 'DELETE';

class Redo {
    private static readonly $actions: ReplaySubject<ActionType> = new ReplaySubject<ActionType>(5, 10_000);

    static addAction(action: ActionType) {
        Redo.$actions.next(action);
    }

    static redo(): Observable<ActionType> {
        return Redo.$actions.asObservable();
    }
};


describe('Redo', () => {

    it('should accept actions', () => {
        Redo.addAction('COPY');
        Redo.addAction('CUT');
    });

    it('should return from the last 5 actions and only if an action is not older than 10 seconds', () => {
        testScheduler.run((helpers) => {
            const { expectObservable } = helpers;

            Redo.addAction('COPY');
            Redo.addAction('CUT');
            Redo.addAction('PASTE');
            Redo.addAction('CUT');
            Redo.addAction('PASTE');
            Redo.addAction('DELETE');

            expectObservable(Redo.redo()).toBe('(abcde)', { a: 'CUT', b: 'PASTE', c: 'CUT', d: 'PASTE', e: 'DELETE' });

            Redo.addAction('COPY');

            expectObservable(Redo.redo()).toBe('(bcdef)', { b: 'PASTE', c: 'CUT', d: 'PASTE', e: 'DELETE', f: 'COPY' });
        });
    });
});