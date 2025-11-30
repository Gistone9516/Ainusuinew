import type { Post } from '../../types/community';

// ==================== 날짜/시간 포맷팅 ====================

/**
 * ISO 8601 날짜를 상대 시간으로 변환 (예: "2시간 전", "3일 전")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * ISO 8601 날짜를 전체 날짜 형식으로 변환
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// ==================== 인기글 판단 ====================

/**
 * 게시글이 인기글(HOT)인지 판단
 * 조회수 50회 이상 또는 좋아요 20개 이상
 */
export const isHotPost = (post: Post, viewsThreshold = 50, likesThreshold = 20): boolean => {
  return post.views_count >= viewsThreshold || post.likes_count >= likesThreshold;
};

// ==================== 텍스트 처리 ====================

/**
 * 제목 유효성 검사
 */
export const validateTitle = (title: string): {
  isValid: boolean;
  error?: string;
} => {
  if (!title.trim()) {
    return { isValid: false, error: '제목을 입력해주세요.' };
  }
  if (title.length > 100) {
    return { isValid: false, error: '제목은 100자 이내로 입력해주세요.' };
  }
  return { isValid: true };
};

/**
 * 내용 유효성 검사
 */
export const validateContent = (content: string): {
  isValid: boolean;
  error?: string;
} => {
  const stripped = content.trim();
  if (!stripped) {
    return { isValid: false, error: '내용을 입력해주세요.' };
  }
  if (stripped.length < 10) {
    return { isValid: false, error: '내용을 10자 이상 입력해주세요.' };
  }
  return { isValid: true };
};

// ==================== 정렬 ====================

/**
 * 게시글 목록 정렬
 */
export const sortPosts = (
  posts: Post[],
  sortBy: 'recent' | 'popular' | 'views'
): Post[] => {
  const sorted = [...posts];

  switch (sortBy) {
    case 'recent':
      return sorted.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    case 'popular':
      return sorted.sort((a, b) => b.likes_count - a.likes_count);
    case 'views':
      return sorted.sort((a, b) => b.views_count - a.views_count);
    default:
      return sorted;
  }
};

// ==================== 권한 확인 ====================

/**
 * 현재 사용자가 게시글/댓글의 작성자인지 확인
 */
export const isMyContent = (authorUserId: number): boolean => {
  const currentUserId = localStorage.getItem('userId');
  if (!currentUserId) return false;
  return parseInt(currentUserId) === authorUserId;
};
