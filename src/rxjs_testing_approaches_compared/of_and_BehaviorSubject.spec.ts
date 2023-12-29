import { of, Observable, from, BehaviorSubject } from 'rxjs';
import { combineLatestWith, concatMap, map, mergeMap } from 'rxjs/operators';
import { LoadPostsAction, Post } from './types/types';
import { CommentService } from './services/comment.service';
import { PostService } from './services/post.service';


describe('of and BehaviorSubject', () => {

    let postService: PostService;
    let commentService: CommentService;

    beforeEach(() => {
        postService = new PostService();
        commentService = new CommentService();
    });

    it('tests', () => {
        const loadPostAction$: BehaviorSubject<LoadPostsAction> = new BehaviorSubject({ postIds: [5,6,7] });
        const loadPostMock = jest.spyOn(postService, 'loadPost');
        const loadCommentsMock = jest.spyOn(commentService, 'loadComments');

        loadPostMock.mockImplementation((postId: number): Observable<Post> => of(
            {id: postId, content: `content of post ${postId}` }
        ));
        loadCommentsMock.mockImplementation((postId: number): Observable<string[]> => of(
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

        const output: Post[] = [];

        result$.subscribe({
            next: post => output.push(post),
        });

        expect(output).toEqual(expectedPosts);

        loadPostAction$.next({ postIds: [8,9,10] });

        expect(output[3].id).toEqual(8);
        expect(output[4].id).toEqual(9);
        expect(output[5].id).toEqual(10);

        loadPostAction$.next({ postIds: [11,12,13] });

        expect(output[6].id).toEqual(11);
        expect(output[7].id).toEqual(12);
        expect(output[8].id).toEqual(13);

        loadPostAction$.unsubscribe();
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
