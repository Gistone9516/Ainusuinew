import type { Gender, PasswordValidation, PasswordStrength } from '@/types/user';

// ==================== 성별 포맷팅 ====================

export const getGenderLabel = (gender: Gender): string => {
  const labels: Record<Gender, string> = {
    male: '남성',
    female: '여성',
    other: '기타',
    prefer_not_to_say: '선택 안함',
  };
  return labels[gender];
};

// ==================== 태그 카테고리 분류 ====================

export const getTagCategory = (tag: string): string => {
  const techTags = [
    'LLM', '컴퓨터비전', '자연어처리', '머신러닝', '강화학습', '연합학습',
    '모델경량화', '프롬프트엔지니어링', '에지AI', '윤리AI', 'AI보안', '개인화추천',
  ];

  const industryTags = [
    '콘텐츠생성', '이미지생성', '영상생성', '코드생성', '글쓰기지원', '번역',
    '음성합성', '음성인식', '채팅봇', '감정분석', '데이터분석', '예측분석',
    '자동화', '업무효율화', '의사결정지원', '마케팅자동화', '검색최적화', '가격결정',
  ];

  if (techTags.includes(tag)) return '기술 중심';
  if (industryTags.includes(tag)) return '산업/응용';
  return '트렌드/이슈';
};

// 카테고리별 태그 그룹화
export const groupTagsByCategory = (
  tags: string[]
): Record<string, string[]> => {
  return tags.reduce((acc, tag) => {
    const category = getTagCategory(tag);
    if (!acc[category]) acc[category] = [];
    acc[category].push(tag);
    return acc;
  }, {} as Record<string, string[]>);
};

// ==================== 비밀번호 검증 ====================

export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('8자 이상이어야 합니다.');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// 비밀번호 강도 계산
export const getPasswordStrength = (password: string): PasswordStrength => {
  let score = 0;

  if (password.length >= 8) score += 20;
  if (password.length >= 12) score += 10;
  if (/[A-Z]/.test(password)) score += 20;
  if (/[a-z]/.test(password)) score += 20;
  if (/[0-9]/.test(password)) score += 15;
  if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 15;

  if (score < 50) return { level: 'weak', score };
  if (score < 80) return { level: 'medium', score };
  return { level: 'strong', score };
};

// ==================== 날짜 포맷팅 ====================

export const formatJoinDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return '방금 전';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}분 전`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}시간 전`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}일 전`;

  return formatJoinDate(dateString);
};

// ==================== 활동 통계 ====================

export const formatActivityCount = (count: number): string => {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
};

// ==================== 직업 카테고리 매핑 ====================

export const getJobCategoryLabel = (jobCategoryId: number, jobCategories: any[]): string => {
  const category = jobCategories.find(cat => cat.job_category_id === jobCategoryId);
  return category?.job_name || '미설정';
};

// ==================== 이메일 검증 ====================

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ==================== 닉네임 검증 ====================

export const validateNickname = (nickname: string): { isValid: boolean; error?: string } => {
  if (nickname.length < 2) {
    return { isValid: false, error: '닉네임은 2자 이상이어야 합니다.' };
  }

  if (nickname.length > 20) {
    return { isValid: false, error: '닉네임은 20자 이하여야 합니다.' };
  }

  // 특수문자 검증 (한글, 영문, 숫자, 언더스코어만 허용)
  if (!/^[가-힣a-zA-Z0-9_]+$/.test(nickname)) {
    return { isValid: false, error: '닉네임은 한글, 영문, 숫자, 언더스코어만 사용할 수 있습니다.' };
  }

  return { isValid: true };
};

// ==================== 태그 선택 검증 ====================

export const validateTagSelection = (tags: string[], maxTags: number = 10): { isValid: boolean; error?: string } => {
  if (tags.length === 0) {
    return { isValid: false, error: '최소 1개의 태그를 선택해주세요.' };
  }

  if (tags.length > maxTags) {
    return { isValid: false, error: `최대 ${maxTags}개까지 선택 가능합니다.` };
  }

  return { isValid: true };
};
