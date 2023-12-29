import { Observable, of } from 'rxjs';
import { Post } from '../types/types';


export class PostService {
    loadPost(postId: number): Observable<Post> {
      return of(
          {id: postId, content: `content of post ${postId}` }
      );
    }
};
