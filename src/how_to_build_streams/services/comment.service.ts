import { Observable, of } from 'rxjs';


export class CommentService {
    loadComments(postId: number): Observable<string[]> {
        return of(
            [
                `first comment (${postId})`,
                `another comment (${postId})`
            ]
        )
    }
};