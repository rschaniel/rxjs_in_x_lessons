import { createTestScheduler } from '../misc/test_scheduler';
import { sample, sampleTime} from 'rxjs/operators';


describe('sample', () => {

    it('emits when the notifier emits', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('  abcdefg|');
            const notifier$ = cold('-n-n-n-n-n');
            const expected =       '-b-d-f-|';

            expectObservable(source$.pipe(sample(notifier$)))
                .toBe(expected);
        });
    });
});


describe('sampleTime', () => {

    it('samples the source at periodic time intervals', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const source$ = cold('  -abcdefg|');
            const expected =       '--b-d-f-|';

            expectObservable(source$.pipe(sampleTime(2)))
                .toBe(expected);
        });
    });
});