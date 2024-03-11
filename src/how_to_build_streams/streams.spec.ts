import { createTestScheduler } from '../misc/test_scheduler';
import { concatMap, map, mergeMap, withLatestFrom, tap, switchMap } from 'rxjs/operators';
import { Observable, of, from } from 'rxjs';
import { LoadPostAction , User, Post } from './types/types';
import { PostService } from './services/post.service';


describe('building streams', () => {

    it('does not work', (done) => {
        const action$: Observable<LoadPostAction> = of({ postId: 1 });
        const postService = new PostService();

        action$.pipe(
            map(action => action.postId),
            concatMap((postId) => postService.loadPost(postId, null)),
        ).subscribe({
            next: result => {
                expect(result).toEqual({id: 1, content: 'content of post 1'});
                done();
            },
        });
    });

    it('get user ID nested', (done) => {
        const action$: Observable<LoadPostAction> = of({ postId: 1 });
        const postService = new PostService();
        const user: User = { getCurrentUserId$: () => of(99) };

        action$.pipe(
            map(action => action.postId),
            concatMap((postId) => {
                return user.getCurrentUserId$().pipe(
                    map((userId) => postService.loadPost(postId, userId))
                );
            })
        ).subscribe({
            next: result => {
                expect(result).toEqual({id: 1, content: 'content of post 1'});
                done();
            },
        });
    });

    it('get user ID flat', (done) => {
        const action$: Observable<LoadPostAction> = of({ postId: 1 });
        const postService = new PostService();
        const user: User = { getCurrentUserId$: () => of(99) };

        action$.pipe(
            map(action => action.postId),
            withLatestFrom(user.getCurrentUserId$()),
            concatMap(([postId, userId]) => postService.loadPost(postId, userId)),
        ).subscribe({
            next: result => {
                expect(result).toEqual({id: 1, content: 'content of post 1'});
                done();
            },
        });
    });

    it('get user ID flat', (done) => {
        const action$: Observable<LoadPostAction> = of({ postId: 1 });
        const postService = new PostService();
        const user: User = { getCurrentUserId$: () => of(99) };

        action$.pipe(
            map((action: LoadPostAction) => action.postId),
            withLatestFrom(user.getCurrentUserId$()),
            concatMap(([postId, userId]: [number, number]) => postService.loadPost(postId, userId)),
        ).subscribe({
            next: (result: Post) => {
                expect(result).toEqual({id: 1, content: 'content of post 1'});
                done();
            },
        });
    });
});