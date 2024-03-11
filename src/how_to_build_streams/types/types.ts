import { Observable } from 'rxjs';

export interface Post {
    id: number,
    content: string,
    comments?: string[]
}

export interface LoadPostAction {
    postId: number;
}

export interface User {
    getCurrentUserId$: () => Observable<number>
}
