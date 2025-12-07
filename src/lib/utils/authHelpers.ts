import type {
  PasswordValidation,
  OAuthConfig,
  OAuthProvider,
} from '../../types/auth';

// ==================== 이메일 검증 ====================

/**
 * 이메일 형식 검증
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 이메일 도메인 추출
 */
export const extractEmailDomain = (email: string): string => {
  return email.split('@')[1] || '';
};

// ==================== 비밀번호 검증 ====================

/**
 * 비밀번호 강도 검증
 * - 8자 이상
 * - 대문자 포함
 * - 소문자 포함
 * - 숫자 포함
 * - 특수문자 포함
 */
export const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  let strength: 'weak' | 'medium' | 'strong' = 'weak';

  // 길이 검사
  if (password.length < 8) {
    errors.push('비밀번호는 8자 이상이어야 합니다.');
  }

  // 대문자 검사
  if (!/[A-Z]/.test(password)) {
    errors.push('대문자를 포함해야 합니다.');
  }

  // 소문자 검사
  if (!/[a-z]/.test(password)) {
    errors.push('소문자를 포함해야 합니다.');
  }

  // 숫자 검사
  if (!/[0-9]/.test(password)) {
    errors.push('숫자를 포함해야 합니다.');
  }

  // 특수문자 검사
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('특수문자를 포함해야 합니다.');
  }

  // 강도 결정
  const score = 5 - errors.length;
  if (score >= 5) strength = 'strong';
  else if (score >= 3) strength = 'medium';
  else strength = 'weak';

  return {
    isValid: errors.length === 0,
    errors,
    strength,
  };
};

/**
 * 비밀번호 확인 검증
 */
export const validatePasswordConfirm = (
  password: string,
  passwordConfirm: string
): boolean => {
  return password === passwordConfirm;
};

/**
 * 비밀번호 강도 색상
 */
export const getPasswordStrengthColor = (
  strength: 'weak' | 'medium' | 'strong'
): {
  color: string;
  bgColor: string;
  label: string;
} => {
  switch (strength) {
    case 'strong':
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-500',
        label: '강함',
      };
    case 'medium':
      return {
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-500',
        label: '보통',
      };
    case 'weak':
      return {
        color: 'text-red-600',
        bgColor: 'bg-red-500',
        label: '약함',
      };
  }
};

// ==================== 닉네임 검증 ====================

/**
 * 닉네임 검증
 * - 2~20자
 * - 한글, 영문, 숫자만 가능
 */
export const validateNickname = (nickname: string): {
  isValid: boolean;
  message?: string;
} => {
  if (nickname.length < 2 || nickname.length > 20) {
    return {
      isValid: false,
      message: '닉네임은 2~20자 사이여야 합니다.',
    };
  }

  const nicknameRegex = /^[가-힣a-zA-Z0-9]+$/;
  if (!nicknameRegex.test(nickname)) {
    return {
      isValid: false,
      message: '닉네임은 한글, 영문, 숫자만 사용 가능합니다.',
    };
  }

  return { isValid: true };
};

// ==================== OAuth 설정 ====================

/**
 * OAuth 제공자 설정
 */
export const OAUTH_CONFIGS: Record<OAuthProvider, OAuthConfig> = {
  google: {
    provider: 'google',
    authUrl: '/auth/google',
    icon: '🔵',
    label: 'Google로 계속하기',
    color: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50',
  },
  kakao: {
    provider: 'kakao',
    authUrl: '/auth/kakao',
    icon: '💬',
    label: 'Kakao로 계속하기',
    color: 'bg-yellow-300 hover:bg-yellow-400 text-gray-900 border-yellow-400',
  },
  naver: {
    provider: 'naver',
    authUrl: '/auth/naver',
    icon: 'N',
    label: 'Naver로 계속하기',
    color: 'bg-green-500 hover:bg-green-600 text-white border-green-500',
  },
};

/**
 * OAuth 설정 조회
 */
export const getOAuthConfig = (provider: OAuthProvider): OAuthConfig => {
  return OAUTH_CONFIGS[provider];
};

// ==================== 에러 메시지 매핑 ====================

/**
 * 에러 코드를 사용자 친화적 메시지로 변환
 */
export const getAuthErrorMessage = (code: number): string => {
  const errorMessages: Record<number, string> = {
    // 회원가입 에러
    1001: '이미 사용 중인 이메일입니다.',
    1002: '이미 사용 중인 닉네임입니다.',
    1003: '비밀번호가 보안 요구사항을 충족하지 않습니다.',
    1004: '올바른 이메일 형식이 아닙니다.',

    // 로그인 에러
    2001: '이메일 또는 비밀번호가 올바르지 않습니다.',
    2002: '등록되지 않은 계정입니다.',
    2003: '계정이 잠겼습니다. 잠시 후 다시 시도해주세요.',

    // 토큰 에러
    3001: '세션이 만료되었습니다. 다시 로그인해주세요.',
    3002: '유효하지 않은 토큰입니다.',
  };

  return errorMessages[code] || '알 수 없는 오류가 발생했습니다.';
};

// ==================== Rate Limit 관리 ====================

/**
 * Rate Limit 시도 횟수 저장
 */
export const saveLoginAttempt = (): void => {
  const attempts = getLoginAttempts();
  localStorage.setItem('loginAttempts', JSON.stringify({
    count: attempts.count + 1,
    timestamp: Date.now(),
  }));
};

/**
 * Rate Limit 시도 횟수 조회
 */
export const getLoginAttempts = (): { count: number; timestamp: number } => {
  const stored = localStorage.getItem('loginAttempts');
  if (!stored) return { count: 0, timestamp: 0 };

  const data = JSON.parse(stored);

  // 15분 경과 시 초기화
  if (Date.now() - data.timestamp > 15 * 60 * 1000) {
    return { count: 0, timestamp: 0 };
  }

  return data;
};

/**
 * Rate Limit 초과 확인
 */
export const isRateLimitExceeded = (): boolean => {
  const attempts = getLoginAttempts();
  return attempts.count >= 5;
};

/**
 * Rate Limit 초기화
 */
export const clearLoginAttempts = (): void => {
  localStorage.removeItem('loginAttempts');
};

// ==================== Remember Me 관리 ====================

/**
 * Remember Me 저장
 */
export const saveRememberMe = (email: string): void => {
  localStorage.setItem('rememberedEmail', email);
};

/**
 * Remember Me 조회
 */
export const getRememberedEmail = (): string | null => {
  return localStorage.getItem('rememberedEmail');
};

/**
 * Remember Me 삭제
 */
export const clearRememberMe = (): void => {
  localStorage.removeItem('rememberedEmail');
};

// ==================== 날짜 포맷팅 ====================

/**
 * 가입일 포맷팅
 */
export const formatJoinDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};
