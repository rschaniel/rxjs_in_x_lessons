import { of, Observable, from } from 'rxjs';
import { combineLatestWith, concatMap, map, mergeMap } from 'rxjs/operators';
import { Post } from './types/types';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { createObservableWithValues, createSpyFromClass } from 'jest-auto-spies';
import { CommentService } from './services/comment.service';
import { PostService } from './services/post.service';


describe('spies', () => {

    let postService: PostService;
    let commentService: CommentService;

    beforeEach(() => {
        postService = new PostService();
        commentService = new CommentService();
    });

    it('tests', async() => {
        let loadPostActionSpy$ = createObservableWithValues(
            [
                { value: { postIds: [5,6,7] } },
                { value: { postIds: [8,9,10] }, delay: 1000 },
                { complete: true },
            ],
            { returnSubject: true }
        );
        const loadPostAction$ = loadPostActionSpy$.values$;

        const postServiceSpy = createSpyFromClass(PostService);
        const commentServiceSpy = createSpyFromClass(CommentService);

        postServiceSpy.loadPost.mockImplementation((postId: number): Observable<Post> => of(
            {id: postId, content: `content of post ${postId}` }
        ));
        commentServiceSpy.loadComments.mockImplementation((postId: number): Observable<string[]> => of(
            [
                `first comment (${postId})`,
                `another comment (${postId})`
            ]
        ));

        const result$ = loadPostAction$.pipe(
            map(action => action.postIds),
            concatMap((postIds: number[]) =>
                from(postIds).pipe(
                    mergeMap(postId => postService.loadPost(postId)),
                ),
            ),
            mergeMap(post => commentService.loadComments(post.id).pipe(
                map(comments => ({...post, comments: comments}))
            )),
        );

        const observerSpy = subscribeSpyTo(result$);

        expect(observerSpy.getValues()).toEqual(expectedPosts);

        await observerSpy.onComplete();

        expect(observerSpy.getLastValue()?.id).toEqual(10);
        expect(observerSpy.receivedComplete()).toBe(true);
    });

    const expectedPosts: Post[] = [
        {
            id: 5,
            content: 'content of post 5',
            comments: [ 'first comment (5)', 'another comment (5)' ]
        },
        {
            id: 6,
            content: 'content of post 6',
            comments: [ 'first comment (6)', 'another comment (6)' ]
        },
        {
            id: 7,
            content: 'content of post 7',
            comments: [ 'first comment (7)', 'another comment (7)' ]
        }
    ];
});
