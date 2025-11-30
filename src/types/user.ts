// ==================== 공통 타입 ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
  workflow_id?: string;
}

export interface PaginatedData<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  hasMore?: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ==================== 성별 타입 ====================
export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

export const GENDER_OPTIONS = [
  { value: 'male' as const, label: '남성' },
  { value: 'female' as const, label: '여성' },
  { value: 'other' as const, label: '기타' },
  { value: 'prefer_not_to_say' as const, label: '선택 안함' },
];

// ==================== 언어 타입 ====================
export type Language = 'ko' | 'en' | 'ja';

export const LANGUAGE_OPTIONS = [
  { value: 'ko' as const, label: '한국어', flag: '🇰🇷' },
  { value: 'en' as const, label: 'English', flag: '🇺🇸' },
  { value: 'ja' as const, label: '日本語', flag: '🇯🇵' },
];

// ==================== 직업 카테고리 ====================
export interface JobCategoryData {
  job_category_id: number;
  job_name: string;
  category_code: string;
  description?: string;
}

// ==================== 관심 태그 (40개) ====================
export const INTEREST_TAGS = [
  // 기술 중심 (12개)
  'LLM',
  '컴퓨터비전',
  '자연어처리',
  '머신러닝',
  '강화학습',
  '연합학습',
  '모델경량화',
  '프롬프트엔지니어링',
  '에지AI',
  '윤리AI',
  'AI보안',
  '개인화추천',
  // 산업/응용 (18개)
  '콘텐츠생성',
  '이미지생성',
  '영상생성',
  '코드생성',
  '글쓰기지원',
  '번역',
  '음성합성',
  '음성인식',
  '채팅봇',
  '감정분석',
  '데이터분석',
  '예측분석',
  '자동화',
  '업무효율화',
  '의사결정지원',
  '마케팅자동화',
  '검색최적화',
  '가격결정',
  // 트렌드/이슈 (10개)
  'AI일자리',
  'AI윤리',
  'AI규제',
  'AI성능',
  '모델출시',
  '오픈소스',
  '의료진단',
  '교육지원',
  '비용절감',
  '기술트렌드',
] as const;

export type InterestTag = typeof INTEREST_TAGS[number];

export interface InterestTagData {
  interest_tag_id: number;
  tag_name: string;
  tag_code: string;
  category?: string;
}

// ==================== 사용자 타입 (백엔드 응답 기준) ====================
export interface User {
  user_id: number;
  email: string;
  nickname: string;
  profile_image_url: string | null;
  job_category_id: number;
  auth_provider: 'local' | 'google' | 'kakao' | 'naver';
  created_at: string;
}

// ==================== 프론트엔드 전용 타입 (localStorage) ====================
export interface UserPreferences {
  gender?: Gender;
  interest_tags?: string[];  // 태그명 배열
  job_category_name?: string;
}

// ==================== 확장된 사용자 정보 (백엔드 + 프론트엔드) ====================
export interface ExtendedUser extends User {
  gender?: Gender;
  interest_tags?: string[];
  job_category_name?: string;
}

// ==================== 앱 설정 타입 ====================
export interface AppSettings {
  theme: 'light' | 'dark';
  language: Language;
}

export interface NotificationSettings {
  push: boolean;
  content: boolean;
  community: boolean;
}

// ==================== 내 게시글/댓글 타입 ====================
export interface MyPost {
  post_id: number;
  title: string;
  content?: string;
  author: {
    user_id: number;
    nickname: string;
    profile_image_url?: string | null;
  };
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
  updated_at?: string;
}

export interface MyComment {
  comment_id: number;
  content: string;
  post_id: number;
  post_title: string;
  author: {
    user_id: number;
    nickname: string;
  };
  likes_count: number;
  created_at: string;
}

// ==================== API Request 타입 ====================
export interface UpdateProfileRequest {
  nickname?: string;
  gender?: Gender;
  job_category_id?: number;
  interest_tags?: string[];
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ==================== API Response 타입 ====================
export type GetJobCategoriesResponse = ApiResponse<JobCategoryData[]>;
export type GetMyPostsResponse = ApiResponse<PaginatedData<MyPost>>;
export type GetMyCommentsResponse = ApiResponse<PaginatedData<MyComment>>;
export type DeletePostResponse = ApiResponse<{ message: string }>;
export type DeleteCommentResponse = ApiResponse<{ message: string }>;
export type DeleteAccountResponse = ApiResponse<{ message: string }>;

// ==================== 유틸리티 타입 ====================
export interface PasswordStrength {
  level: 'weak' | 'medium' | 'strong';
  score: number;
}

export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
}
