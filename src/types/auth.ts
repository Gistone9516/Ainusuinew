// ==================== 공통 타입 ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  timestamp?: string;
  workflow_id?: string;
}

export interface ApiError {
  success: false;
  error: {
    code: number;
    message: string;
    details?: any;
  };
  timestamp?: string;
  workflow_id?: string;
}

// ==================== 사용자 타입 ====================
export interface User {
  user_id: number;
  email: string;
  nickname: string;
  profile_image_url: string | null;
  job_category_id: number;
  auth_provider?: 'local' | 'google' | 'kakao' | 'naver';
  created_at: string;
}

export interface UserProfile extends User {
  job_category_name?: string;
}

// ==================== 토큰 타입 ====================
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string; // "15m"
}

export interface TokenPayload {
  user_id: number;
  email: string;
  iat: number;
  exp: number;
}

// ==================== 인증 요청 타입 ====================
export interface RegisterRequest {
  email: string;
  password: string;
  nickname: string;
  job_category_id?: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

// ==================== 인증 응답 타입 ====================
export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface RefreshTokenResponse {
  accessToken: string;
  expiresIn: string;
}

export interface EmailCheckResponse {
  available: boolean;
}

// ==================== API Response 타입 ====================
export type RegisterResponse = ApiResponse<AuthResponse>;
export type LoginResponse = ApiResponse<AuthResponse>;
export type RefreshResponse = ApiResponse<RefreshTokenResponse>;
export type LogoutResponse = ApiResponse<{ message: string }>;
export type MeResponse = ApiResponse<User>;
export type EmailCheckApiResponse = ApiResponse<EmailCheckResponse>;
export type PasswordResetResponse = ApiResponse<{ message: string }>;

// ==================== 에러 코드 ====================
export enum AuthErrorCode {
  // 회원가입 에러
  EMAIL_ALREADY_REGISTERED = 1001,
  NICKNAME_ALREADY_TAKEN = 1002,
  PASSWORD_STRENGTH_FAILED = 1003,
  INVALID_EMAIL_FORMAT = 1004,

  // 로그인 에러
  INVALID_CREDENTIALS = 2001,
  ACCOUNT_NOT_FOUND = 2002,
  ACCOUNT_LOCKED = 2003,

  // 토큰 에러
  TOKEN_EXPIRED = 3001,
  INVALID_TOKEN = 3002,
}

// ==================== UI State 타입 ====================
export interface LoginFormState {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormState {
  email: string;
  password: string;
  passwordConfirm: string;
  nickname: string;
  agreeTerms: boolean;
  agreePrivacy: boolean;
}

export interface ForgotPasswordFormState {
  email: string;
}

export interface ResetPasswordFormState {
  token: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export interface AuthPageState {
  currentView: 'login' | 'register' | 'forgot-password' | 'reset-password';
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

// ==================== 비밀번호 검증 타입 ====================
export interface PasswordValidation {
  isValid: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong';
}

// ==================== OAuth Provider ====================
export type OAuthProvider = 'google' | 'kakao' | 'naver';

export interface OAuthConfig {
  provider: OAuthProvider;
  authUrl: string;
  icon: string;
  label: string;
  color: string;
}
