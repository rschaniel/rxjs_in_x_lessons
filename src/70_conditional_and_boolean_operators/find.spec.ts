import { createTestScheduler } from '../misc/test_scheduler';
import { find } from 'rxjs/operators';


describe('find', () => {

    it('emits first value that matches a condition and completes', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('123456789|').pipe(
                find(v => v % 3 === 0)
            );

            expectObservable(result$).toBe(
                '--(v|)', { v: "3" }
            );
        });
    });

    it('emits undefined if no value fulfills the condition', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('1357|').pipe(
                find(v => v % 2 === 0)
            );

            expectObservable(result$).toBe(
                '----(u|)', { u: undefined }
            );
        });
    });
});
