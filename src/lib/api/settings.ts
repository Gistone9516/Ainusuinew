import type { AppSettings, NotificationSettings } from '@/types/user';

// localStorage 키 상수
const STORAGE_KEYS = {
  APP_SETTINGS: 'appSettings',
  NOTIFICATION_SETTINGS: 'notificationSettings',
} as const;

// ==================== 앱 설정 (localStorage) ====================

/**
 * 앱 설정 불러오기
 */
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

/**
 * 앱 설정 저장
 */
export const saveAppSettings = (settings: AppSettings): void => {
  localStorage.setItem(STORAGE_KEYS.APP_SETTINGS, JSON.stringify(settings));
};

/**
 * 테마 변경
 */
export const setTheme = (theme: 'light' | 'dark'): void => {
  const settings = getAppSettings();
  settings.theme = theme;
  saveAppSettings(settings);

  // HTML에 클래스 적용
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};

/**
 * 현재 테마 가져오기
 */
export const getTheme = (): 'light' | 'dark' => {
  const settings = getAppSettings();
  return settings.theme;
};

/**
 * 언어 변경
 */
export const setLanguage = (language: 'ko' | 'en' | 'ja'): void => {
  const settings = getAppSettings();
  settings.language = language;
  saveAppSettings(settings);

  // TODO: i18n 라이브러리 연동 시 언어 적용 로직 추가
};

/**
 * 현재 언어 가져오기
 */
export const getLanguage = (): 'ko' | 'en' | 'ja' => {
  const settings = getAppSettings();
  return settings.language;
};

// ==================== 알림 설정 (localStorage) ====================

/**
 * 알림 설정 불러오기
 */
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

/**
 * 알림 설정 저장
 */
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  localStorage.setItem(STORAGE_KEYS.NOTIFICATION_SETTINGS, JSON.stringify(settings));
};

/**
 * 개별 알림 설정 업데이트
 */
export const updateNotificationSetting = (
  key: keyof NotificationSettings,
  value: boolean
): void => {
  const settings = getNotificationSettings();
  settings[key] = value;
  saveNotificationSettings(settings);
};

// ==================== 앱 데이터 초기화 ====================

/**
 * 앱 데이터 초기화 (토큰 제외)
 */
export const resetAppData = (): void => {
  // 토큰 제외 모든 로컬 데이터 삭제
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  localStorage.clear();

  if (accessToken) localStorage.setItem('accessToken', accessToken);
  if (refreshToken) localStorage.setItem('refreshToken', refreshToken);

  // 기본 설정으로 재설정
  saveAppSettings({ theme: 'light', language: 'ko' });
  saveNotificationSettings({ push: true, content: true, community: true });
};

/**
 * 전체 데이터 초기화 (토큰 포함)
 */
export const resetAllData = (): void => {
  localStorage.clear();
};

// ==================== 테마 초기화 (앱 시작 시 호출) ====================

/**
 * 저장된 테마 적용 (앱 시작 시 호출)
 */
export const initializeTheme = (): void => {
  const theme = getTheme();
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
};
