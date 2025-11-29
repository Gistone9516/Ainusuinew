// ==================== 공통 타입 ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

// ==================== 게시글 타입 ====================

export interface Author {
  user_id: number;
  nickname: string;
  profile_image_url?: string | null;
}

export interface Post {
  post_id: number;
  title: string;
  author: Author;
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
}

export interface PostDetail extends Post {
  content: string;
  is_liked: boolean;
  updated_at: string;
}

// ==================== 댓글 타입 ====================

export interface Comment {
  comment_id: number;
  content: string;
  author: Author;
  likes_count: number;
  created_at: string;
  updated_at?: string;
}

// ==================== API Request 타입 ====================

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
}

export interface GetPostsParams {
  page?: number;
  limit?: number;
  sort?: 'recent' | 'popular' | 'views';
}

export interface SearchPostsParams extends GetPostsParams {
  q: string;
}

export interface GetCommentsParams {
  page?: number;
  limit?: number;
}

// ==================== API Response 타입 ====================

export type CreatePostResponse = ApiResponse<PostDetail>;
export type GetPostsResponse = ApiResponse<PaginatedData<Post>>;
export type GetPostDetailResponse = ApiResponse<PostDetail>;
export type UpdatePostResponse = ApiResponse<{
  post_id: number;
  title: string;
  updated_at: string;
}>;
export type DeletePostResponse = ApiResponse<null>;

export type ToggleLikeResponse = ApiResponse<{
  post_id: number;
  is_liked: boolean;
  likes_count: number;
}>;

export type GetCommentsResponse = ApiResponse<PaginatedData<Comment>>;
export type CreateCommentResponse = ApiResponse<Comment>;
