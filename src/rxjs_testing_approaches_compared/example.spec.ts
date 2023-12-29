import { of, Observable, from } from 'rxjs';
import { concatMap, map, mergeMap } from 'rxjs/operators';
import { LoadPostsAction } from './types/types';
import { CommentService } from './services/comment.service';
import { PostService } from './services/post.service';


describe('example', () => {

    let postService: PostService;
    let commentService: CommentService;

    beforeEach(() => {
        postService = new PostService();
        commentService = new CommentService();
    });

    it('runs', (done) => {
        const loadPostAction$: Observable<LoadPostsAction> = of({ postIds: [5,6,7] });

        const result$ = loadPostAction$.pipe(
            map(action => action.postIds),
            concatMap((postIds: number[]) =>
                from(postIds).pipe(
                    mergeMap(postId => postService.loadPost(postId)),
                ),
            ),
            mergeMap(post => commentService.loadComments(post.id).pipe(
                map(comments => ({ ...post, comments: comments }))
            )),
        );

        result$.subscribe({
            next: v => console.log(v),
            complete: done,
        });
    });
});
