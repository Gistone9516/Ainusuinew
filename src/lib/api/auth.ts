import apiClient from './client';
import type * as T from '../../types/auth';

// ==================== 회원가입 API ====================

/**
 * 1. 회원가입
 */
export const register = async (
  data: T.RegisterRequest
): Promise<T.RegisterResponse> => {
  const response = await apiClient.post<T.RegisterResponse>(
    '/auth/register',
    data
  );

  // 토큰 저장
  if (response.data.data?.tokens) {
    saveTokens(response.data.data.tokens);
  }

  return response.data;
};

/**
 * 2. 이메일 중복 확인
 */
export const checkEmailAvailability = async (
  email: string
): Promise<T.EmailCheckApiResponse> => {
  const { data } = await apiClient.get<T.EmailCheckApiResponse>(
    '/auth/check-email',
    { params: { email } }
  );
  return data;
};

// ==================== 로그인 API ====================

/**
 * 3. 로그인
 */
export const login = async (
  data: T.LoginRequest
): Promise<T.LoginResponse> => {
  const response = await apiClient.post<T.LoginResponse>(
    '/auth/login',
    data
  );

  // 토큰 저장
  if (response.data.data?.tokens) {
    saveTokens(response.data.data.tokens);
  }

  return response.data;
};

/**
 * 4. 토큰 갱신
 */
export const refreshToken = async (
  refreshToken: string
): Promise<T.RefreshResponse> => {
  const { data } = await apiClient.post<T.RefreshResponse>(
    '/auth/refresh',
    { refreshToken }
  );

  // 새 Access Token 저장
  if (data.data?.accessToken) {
    localStorage.setItem('accessToken', data.data.accessToken);
  }

  return data;
};

/**
 * 5. 로그아웃
 */
export const logout = async (): Promise<T.LogoutResponse> => {
  const { data } = await apiClient.post<T.LogoutResponse>(
    '/auth/logout'
  );

  // 토큰 삭제
  clearTokens();

  return data;
};

/**
 * 6. 현재 사용자 정보
 */
export const getCurrentUser = async (): Promise<T.User> => {
  const { data } = await apiClient.get<T.MeResponse>('/auth/me');
  return data.data!;
};

// ==================== 비밀번호 관리 API ====================

/**
 * 7. 비밀번호 재설정 요청
 */
export const forgotPassword = async (
  email: string
): Promise<T.PasswordResetResponse> => {
  const { data } = await apiClient.post<T.PasswordResetResponse>(
    '/auth/forgot-password',
    { email }
  );
  return data;
};

/**
 * 8. 비밀번호 재설정
 */
export const resetPassword = async (
  data: T.ResetPasswordRequest
): Promise<T.PasswordResetResponse> => {
  const response = await apiClient.post<T.PasswordResetResponse>(
    '/auth/reset-password',
    data
  );
  return response.data;
};

/**
 * 9. 비밀번호 변경 (인증 필요)
 */
export const changePassword = async (
  data: T.ChangePasswordRequest
): Promise<T.PasswordResetResponse> => {
  const response = await apiClient.post<T.PasswordResetResponse>(
    '/auth/change-password',
    data
  );
  return response.data;
};

// ==================== OAuth API ====================

/**
 * 10. OAuth 로그인 URL 생성
 */
export const getOAuthUrl = (provider: T.OAuthProvider): string => {
  return `/auth/${provider}`;
};

/**
 * OAuth 로그인 시작
 */
export const initiateOAuthLogin = (provider: T.OAuthProvider): void => {
  const baseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
  window.location.href = `${baseUrl}/auth/${provider}`;
};

// ==================== 토큰 관리 헬퍼 ====================

/**
 * 토큰 저장
 */
export const saveTokens = (tokens: T.AuthTokens): void => {
  localStorage.setItem('accessToken', tokens.accessToken);
  localStorage.setItem('refreshToken', tokens.refreshToken);
  localStorage.setItem('tokenExpiresIn', tokens.expiresIn);
};

/**
 * Access Token 조회
 */
export const getAccessToken = (): string | null => {
  return localStorage.getItem('accessToken');
};

/**
 * Refresh Token 조회
 */
export const getRefreshToken = (): string | null => {
  return localStorage.getItem('refreshToken');
};

/**
 * 토큰 삭제
 */
export const clearTokens = (): void => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenExpiresIn');
};

/**
 * 로그인 상태 확인
 */
export const isAuthenticated = (): boolean => {
  return !!getAccessToken();
};

/**
 * 토큰 디코딩 (JWT payload 추출)
 */
export const decodeToken = (token: string): T.TokenPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

/**
 * 토큰 만료 확인
 */
export const isTokenExpired = (token: string): boolean => {
  const payload = decodeToken(token);
  if (!payload) return true;
  return payload.exp * 1000 < Date.now();
};

/**
 * 자동 토큰 갱신
 */
export const autoRefreshToken = async (): Promise<boolean> => {
  const refresh = getRefreshToken();
  if (!refresh) return false;

  try {
    const response = await refreshToken(refresh);
    return !!response.data?.accessToken;
  } catch (error) {
    clearTokens();
    return false;
  }
};
