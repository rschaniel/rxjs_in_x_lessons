import { Observable, from } from 'rxjs';
import { combineLatestWith, concatMap, map, mergeMap } from 'rxjs/operators';
import { LoadPostsAction, Post } from './types/types';
import { TestScheduler } from 'rxjs/testing';
import { PostService } from './services/post.service';
import { CommentService } from './services/comment.service';


describe('marbles', () => {

    let postService: PostService;
    let commentService: CommentService;

    beforeEach(() => {
        postService = new PostService();
        commentService = new CommentService();
    });

    const testScheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    it('tests', () => {
        testScheduler.run((helpers) => {
            const { cold, expectObservable, hot } = helpers;

            const loadPostAction$: Observable<LoadPostsAction> = hot('-a-----b-------|', {
                a: { postIds: [5,6,7] },
                b: { postIds: [8,9,10] },
            });
            const loadPostMock = jest.spyOn(postService, 'loadPost');
            const loadCommentsMock = jest.spyOn(commentService, 'loadComments');

            loadPostMock.mockImplementation((postId: number): Observable<Post> => cold('-r|', {
                r: {id: postId, content: `content of post ${postId}`}
            }));
            loadCommentsMock.mockImplementation((postId: number): Observable<string[]> => cold('--r|', {
                r: [
                    `first comment (${postId})`,
                    `another comment (${postId})`
                ]
            }));

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

            expectObservable(result$).toBe('----(abc)-(def)|', {
                a: {
                    id: 5,
                    content: 'content of post 5',
                    comments: [ 'first comment (5)', 'another comment (5)' ]
                },
                b: {
                    id: 6,
                    content: 'content of post 6',
                    comments: [ 'first comment (6)', 'another comment (6)' ]
                },
                c: {
                    id: 7,
                    content: 'content of post 7',
                    comments: [ 'first comment (7)', 'another comment (7)' ]
                },
                d: {
                    id: 8,
                    content: 'content of post 8',
                    comments: [ 'first comment (8)', 'another comment (8)' ]
                },
                e: {
                    id: 9,
                    content: 'content of post 9',
                    comments: [ 'first comment (9)', 'another comment (9)' ]
                },
                f: {
                    id: 10,
                    content: 'content of post 10',
                    comments: [ 'first comment (10)', 'another comment (10)' ]
                }
            });
        });
    });
});
