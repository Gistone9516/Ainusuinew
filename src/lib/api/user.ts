import apiClient from './client';
import { getCurrentUser as getAuthUser } from './auth';
import type * as T from '@/types/user';

// ==================== 사용자 정보 API ====================

/**
 * 현재 사용자 정보 조회 (auth.ts에서 재사용)
 */
export const getCurrentUser = getAuthUser;

/**
 * 확장된 사용자 정보 조회 (백엔드 + localStorage)
 */
export const getExtendedUser = async (): Promise<T.ExtendedUser> => {
  const user = await getCurrentUser();

  // localStorage에서 추가 정보 가져오기
  const preferencesStr = localStorage.getItem('userPreferences');
  const preferences: T.UserPreferences = preferencesStr ? JSON.parse(preferencesStr) : {};

  // 직업 카테고리명 가져오기
  let job_category_name = preferences.job_category_name;
  if (!job_category_name && user.job_category_id) {
    try {
      const jobCategories = await getJobCategories();
      const category = jobCategories.find(cat => cat.job_category_id === user.job_category_id);
      job_category_name = category?.job_name;
    } catch (error) {
      console.error('Failed to fetch job categories:', error);
    }
  }

  return {
    ...user,
    auth_provider: user.auth_provider || 'local',
    gender: preferences.gender,
    interest_tags: preferences.interest_tags,
    job_category_name,
  };
};

/**
 * 프로필 업데이트 (백엔드 API 없음 - localStorage만 저장)
 */
export const updateProfile = async (profileData: T.UpdateProfileRequest): Promise<void> => {
  // TODO: 백엔드 API 구현 대기 - PUT /api/v1/users/profile

  // 임시로 localStorage에만 저장
  const preferencesStr = localStorage.getItem('userPreferences');
  const currentPreferences: T.UserPreferences = preferencesStr ? JSON.parse(preferencesStr) : {};

  const updatedPreferences: T.UserPreferences = {
    ...currentPreferences,
    gender: profileData.gender,
    interest_tags: profileData.interest_tags,
  };

  // 직업 카테고리명 저장 (백엔드에는 job_category_id만 있으므로)
  if (profileData.job_category_id) {
    try {
      const jobCategories = await getJobCategories();
      const category = jobCategories.find(cat => cat.job_category_id === profileData.job_category_id);
      if (category) {
        updatedPreferences.job_category_name = category.job_name;
      }
    } catch (error) {
      console.error('Failed to fetch job category name:', error);
    }
  }

  localStorage.setItem('userPreferences', JSON.stringify(updatedPreferences));

  // 백엔드 API가 준비되면 아래 코드 사용
  /*
  const { data } = await apiClient.put<T.ApiResponse<T.User>>(
    '/users/profile',
    profileData
  );
  return data.data!;
  */
};

/**
 * 회원 탈퇴 (백엔드 API 없음)
 */
export const deleteAccount = async (): Promise<void> => {
  // TODO: 백엔드 API 구현 대기 - DELETE /api/v1/users/account

  // 임시로 로컬 데이터만 삭제
  localStorage.clear();

  // 백엔드 API가 준비되면 아래 코드 사용
  /*
  const { data } = await apiClient.delete<T.DeleteAccountResponse>('/users/account');
  return data;
  */
};

// ==================== 직업 카테고리 API ====================

/**
 * 직업 카테고리 목록 조회
 */
export const getJobCategories = async (): Promise<T.JobCategoryData[]> => {
  try {
    const { data } = await apiClient.get<T.GetJobCategoriesResponse>('/job-categories');
    console.log('[UserAPI] getJobCategories response:', data);
    
    // 정규화된 응답에서 데이터 추출
    const categories = data?.data || data;
    return Array.isArray(categories) ? categories : [];
  } catch (error: any) {
    console.error('[UserAPI] getJobCategories failed:', error?.message);
    return [];
  }
};

// ==================== 내 활동 API ====================

/**
 * 내 게시글 목록 (클라이언트 측 필터링)
 * 백엔드 API 없음 - GET /api/v1/users/posts
 */
export const getMyPosts = async (
  userId: number,
  params: T.PaginationParams = {}
): Promise<T.PaginatedData<T.MyPost>> => {
  const { page = 1, limit = 20 } = params;

  try {
    // 전체 게시글 가져오기
    const { data } = await apiClient.get<T.GetMyPostsResponse>('/community/posts', {
      params: { page, limit, sort: 'recent' },
    });

    // 정규화된 응답에서 데이터 추출
    const responseData = data?.data || data;
    const items = responseData?.items || [];

    // 클라이언트에서 필터링
    const myPosts = items.filter(
      (post: T.MyPost) => post.author?.user_id === userId
    );

    return {
      items: myPosts,
      total: myPosts.length,
      page,
      limit,
    };
  } catch (error: any) {
    console.error('[UserAPI] getMyPosts failed:', error?.message);
    return {
      items: [],
      total: 0,
      page,
      limit,
    };
  }
};

/**
 * 내 게시글 개수 조회 (클라이언트 측 필터링)
 */
export const getMyPostsCount = async (userId: number): Promise<number> => {
  try {
    // 첫 페이지만 가져와서 필터링 (정확하지 않을 수 있음)
    const result = await getMyPosts(userId, { page: 1, limit: 100 });
    return result.items.length;
  } catch (error) {
    console.error('Failed to get my posts count:', error);
    return 0;
  }
};

/**
 * 내 댓글 목록 (백엔드 API 없음 - 더미 데이터)
 */
export const getMyComments = async (
  params: T.PaginationParams = {}
): Promise<T.PaginatedData<T.MyComment>> => {
  // TODO: 백엔드 API 구현 대기 - GET /api/v1/users/comments

  // 더미 데이터 반환
  return {
    items: [],
    total: 0,
    page: params.page || 1,
    limit: params.limit || 20,
  };
};

/**
 * 내 댓글 개수 조회 (백엔드 API 없음)
 */
export const getMyCommentsCount = async (): Promise<number> => {
  // TODO: 백엔드 API 구현 대기
  return 0;
};

/**
 * 게시글 삭제
 */
export const deletePost = async (postId: number): Promise<void> => {
  await apiClient.delete<T.DeletePostResponse>(
    `/community/posts/${postId}`
  );
};

/**
 * 댓글 삭제 (백엔드 API 없음)
 */
export const deleteComment = async (_commentId: number): Promise<void> => {
  // TODO: 백엔드 API 구현 대기 - DELETE /api/v1/community/comments/:commentId

  // 백엔드 API가 준비되면 아래 코드 사용
  /*
  const { data } = await apiClient.delete<T.DeleteCommentResponse>(
    `/community/comments/${_commentId}`
  );
  */
};
