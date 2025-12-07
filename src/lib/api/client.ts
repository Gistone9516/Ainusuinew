import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Capacitor } from '@capacitor/core';

// Capacitor(Android/iOS) 환경에서는 실제 서버 IP 사용
// 웹에서는 proxy를 통해 상대 경로 사용 (개발 환경)
// 환경변수 VITE_API_BASE_URL이 설정되어 있으면 우선 사용
const getBaseUrl = (): string => {
  // 환경 변수가 설정되어 있으면 우선 사용
  if (import.meta.env.VITE_API_BASE_URL) {
    console.log('[API Client] Using env VITE_API_BASE_URL:', import.meta.env.VITE_API_BASE_URL);
    return import.meta.env.VITE_API_BASE_URL;
  }

  // Capacitor Native 플랫폼 체크
  const isNative = Capacitor.isNativePlatform();
  const platform = Capacitor.getPlatform();
  
  console.log('[API Client] Platform:', platform, '| isNative:', isNative);

  if (isNative) {
    // Native 플랫폼에서는 실제 서버 IP 사용
    // 환경변수가 없을 경우 하드코딩된 IP 사용
    const nativeApiUrl = 'http://192.168.35.125:3000/api';
    console.log('[API Client] Native platform detected, using:', nativeApiUrl);
    return nativeApiUrl;
  }
  
  // 웹 개발 환경: Vite proxy를 통해 상대 경로 사용
  console.log('[API Client] Web environment, using relative path: /api');
  return '/api';
};

const BASE_URL = getBaseUrl();
console.log('[API Client] Final BASE_URL:', BASE_URL);

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config);
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// 응답 데이터 정규화 헬퍼
const normalizeResponseData = (data: any, url: string): any => {
  // 이미 정규화된 응답 ({ success, data } 형태)
  if (data && typeof data === 'object' && 'success' in data && 'data' in data) {
    console.log(`[API Client] Response already normalized for ${url}`);
    return data;
  }
  
  // 배열 응답 - 래핑
  if (Array.isArray(data)) {
    console.log(`[API Client] Wrapping array response for ${url}`);
    return { success: true, data };
  }
  
  // 객체 응답 - 래핑 (success 필드가 없는 경우)
  if (data && typeof data === 'object') {
    console.log(`[API Client] Wrapping object response for ${url}`);
    return { success: true, data };
  }
  
  // 그 외 (null, undefined, primitive) - 그대로 반환
  return data;
};

// Response interceptor - Handle token refresh & normalize response
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const url = response.config.url || '';
    console.log(`[API Response] ${response.status} ${url}`, response.data);
    
    // 응답 데이터 정규화
    response.data = normalizeResponseData(response.data, url);
    
    return response;
  },
  async (error) => {
    console.error('[API Response Error]', error);
    const originalRequest = error.config;

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        // Try to refresh token
        const response = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        // 응답 구조에 따라 accessToken 추출
        const responseData = response.data;
        const accessToken = responseData?.data?.accessToken || responseData?.accessToken;
        if (!accessToken) {
          throw new Error('No access token in refresh response');
        }
        localStorage.setItem('accessToken', accessToken);

        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('tokenExpiresIn');

        // Redirect to login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
