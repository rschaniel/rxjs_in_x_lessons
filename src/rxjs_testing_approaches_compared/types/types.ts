export interface Post {
    id: number,
    content: string,
    comments?: string[]
}

export interface LoadPostsAction {
    postIds: number[]
}
