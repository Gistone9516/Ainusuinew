import type { AppSettings, NotificationSettings, UserPreferences } from '@/types/user';

// localStorage 키 상수
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'accessToken',
  REFRESH_TOKEN: 'refreshToken',
  TOKEN_EXPIRES_IN: 'tokenExpiresIn',
  APP_SETTINGS: 'appSettings',
  NOTIFICATION_SETTINGS: 'notificationSettings',
  USER_PREFERENCES: 'userPreferences',
  USER_CACHE: 'userCache',
} as const;

// ==================== 토큰 관리 ====================

export const getAccessToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
};

export const setAccessToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
};

export const setRefreshToken = (token: string): void => {
  localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, token);
};

export const clearTokens = (): void => {
  localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.TOKEN_EXPIRES_IN);
};

// ==================== 앱 설정 ====================

export const getAppSettings = (): AppSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.APP_SETTINGS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse app settings:', error);
    }
  }

  // 기본값
  return {
    theme: 'light',
    language: 'ko',
  };
};

export const saveAppSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
};

// ==================== 알림 설정 ====================

export const getNotificationSettings = (): NotificationSettings => {
  const stored = localStorage.getItem(STORAGE_KEYS.NOTIFICATION_SETTINGS);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse notification settings:', error);
    }
  }

  // 기본값 (모두 활성화)
  return {
    push: true,
    content: true,
    community: true,
  };
};

export const saveNotificationSettings = (settings: NotificationSettings): void => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
};

// ==================== 사용자 선호 설정 ====================

export const getUserPreferences = (): UserPreferences => {
  const stored = localStorage.getItem(STORAGE_KEYS.USER_PREFERENCES);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse user preferences:', error);
    }
  }

  return {};
};

export const saveUserPreferences = (preferences: UserPreferences): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PREFERENCES, JSON.stringify(preferences));
};

export const updateUserPreferences = (partialPreferences: Partial<UserPreferences>): void => {
  const current = getUserPreferences();
  const updated = { ...current, ...partialPreferences };
  saveUserPreferences(updated);
};

export const clearUserPreferences = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_PREFERENCES);
};

// ==================== 사용자 캐시 ====================

export const getCachedUser = <T = any>(): T | null => {
  const cached = localStorage.getItem(STORAGE_KEYS.USER_CACHE);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (error) {
      console.error('Failed to parse cached user:', error);
    }
  }
  return null;
};

export const setCachedUser = (user: any): void => {
  localStorage.setItem(STORAGE_KEYS.USER_CACHE, JSON.stringify(user));
};

export const clearCachedUser = (): void => {
  localStorage.removeItem(STORAGE_KEYS.USER_CACHE);
};

// ==================== 전체 초기화 ====================

export const clearAllStorage = (): void => {
  localStorage.clear();
};

export const resetAppData = (): void => {
  // 토큰 제외 모든 로컬 데이터 삭제
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();

  localStorage.clear();

  if (accessToken) setAccessToken(accessToken);
  if (refreshToken) setRefreshToken(refreshToken);

  // 기본 설정으로 재설정
  saveAppSettings({ theme: 'light', language: 'ko' });
  saveNotificationSettings({ push: true, content: true, community: true });
};
