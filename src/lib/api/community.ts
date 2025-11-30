import apiClient from './client';
import type * as T from '../../types/community';

// ==================== 게시글 API ====================

/**
 * 1. 게시글 작성
 */
export const createPost = async (data: T.CreatePostRequest): Promise<T.CreatePostResponse> => {
  const response = await apiClient.post<T.CreatePostResponse>(
    '/community/posts',
    data
  );
  return response.data;
};

/**
 * 2. 게시글 목록 조회
 */
export const getPosts = async (params: T.GetPostsParams = {}): Promise<T.GetPostsResponse> => {
  const response = await apiClient.get<T.GetPostsResponse>('/community/posts', {
    params,
  });
  return response.data;
};

/**
 * 3. 게시글 상세 조회
 */
export const getPostDetail = async (postId: number): Promise<T.GetPostDetailResponse> => {
  const response = await apiClient.get<T.GetPostDetailResponse>(
    `/community/posts/${postId}`
  );
  return response.data;
};

/**
 * 4. 게시글 수정
 */
export const updatePost = async (
  postId: number,
  data: T.UpdatePostRequest
): Promise<T.UpdatePostResponse> => {
  const response = await apiClient.put<T.UpdatePostResponse>(
    `/community/posts/${postId}`,
    data
  );
  return response.data;
};

/**
 * 5. 게시글 삭제
 */
export const deletePost = async (postId: number): Promise<T.DeletePostResponse> => {
  const response = await apiClient.delete<T.DeletePostResponse>(
    `/community/posts/${postId}`
  );
  return response.data;
};

/**
 * 6. 게시글 좋아요/취소
 */
export const togglePostLike = async (postId: number): Promise<T.ToggleLikeResponse> => {
  const response = await apiClient.post<T.ToggleLikeResponse>(
    `/community/posts/${postId}/like`
  );
  return response.data;
};

/**
 * 7. 게시글 검색
 */
export const searchPosts = async (params: T.SearchPostsParams): Promise<T.GetPostsResponse> => {
  const response = await apiClient.get<T.GetPostsResponse>(
    '/community/posts/search',
    { params }
  );
  return response.data;
};

// ==================== 댓글 API ====================

/**
 * 8. 댓글 목록 조회
 */
export const getComments = async (
  postId: number,
  params: T.GetCommentsParams = {}
): Promise<T.GetCommentsResponse> => {
  const response = await apiClient.get<T.GetCommentsResponse>(
    `/community/posts/${postId}/comments`,
    { params }
  );
  return response.data;
};

/**
 * 9. 댓글 작성
 */
export const createComment = async (
  postId: number,
  content: string
): Promise<T.CreateCommentResponse> => {
  const response = await apiClient.post<T.CreateCommentResponse>(
    `/community/posts/${postId}/comments`,
    { content }
  );
  return response.data;
};
