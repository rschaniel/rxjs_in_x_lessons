import { createTestScheduler } from '../misc/test_scheduler';
import { findIndex } from 'rxjs/operators';


describe('findIndex', () => {

    it('emits first index of the value that matches a condition and completes', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('123456789|').pipe(
                findIndex(v => v % 3 === 0)
            );

            expectObservable(result$).toBe(
                '--(i|)', { i: 2 }
            );
        });
    });

    it('emits undefined if no value fulfills the condition', () => {
        createTestScheduler().run((helpers) => {
            const {expectObservable, cold} = helpers;

            const result$ = cold<number>('1357|').pipe(
                findIndex(v => v % 2 === 0)
            );

            expectObservable(result$).toBe(
                '----(i|)', { i: -1 }
            );
        });
    });
});
