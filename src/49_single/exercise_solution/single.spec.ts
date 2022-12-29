import { createTestScheduler } from '../../misc/test_scheduler';
import { from, SequenceError } from 'rxjs';
import { single } from 'rxjs/operators';


describe('single', () => {

    it('gets a single winner', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable } = helpers;

            const winner$ = from([
                { rank: 2, team: 'Team Blue' },
                { rank: 1, team: 'Team Red' },
                { rank: 3, team: 'Team Yellow' },
            ]).pipe(single(ranking => ranking.rank === 1));

            expectObservable(winner$).toBe('(w|)', { w: { rank: 1, team: 'Team Red'}});
        });
    });
});
