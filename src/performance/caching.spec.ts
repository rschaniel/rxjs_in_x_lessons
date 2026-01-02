import { createTestScheduler } from '../misc/test_scheduler';
import { share, shareReplay, map, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs';


describe('caching', () => {

    it('is parallel', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const trigger$ = cold('--a----(a|)');
            const backendCall = () => cold('--(1|)');
            const backendCall2 = () => cold('--(2|)');

            const source$ = trigger$.pipe(
                mergeMap(_ => forkJoin({
                    result1: backendCall(),
                    result2: backendCall2()
                })),
                map((result: { result1: string; result2: string }) => result.result2)
            );

            expectObservable(source$).toBe(
                '----(a)--(a|)', { a: '2' });
        });
    });

    it('is cached', () => {
        createTestScheduler().run((helpers) => {
            const { expectObservable, cold } = helpers;

            const trigger$ = cold('--a----(a|)');
            const backendCall = () => cold('--(1|)');
            const backendCall2 = () => cold('--(2|)');

            // Cache at the top level - called once
            const cachedCall1$ = backendCall().pipe(shareReplay({ bufferSize: 1, windowTime: 5000, refCount: true }));
            const cachedCall2$ = backendCall2().pipe(shareReplay({ bufferSize: 1, windowTime: 5000, refCount: true }));

            const source$ = trigger$.pipe(
                mergeMap(_ => forkJoin({
                    result1: cachedCall1$,
                    result2: cachedCall2$,
                })),
                map((result: { result1: string; result2: string }) => result.result2)
            );

            expectObservable(source$).toBe(
                '----(a)(a|)', { a: '2' });
        });
    });
});
