# API 연동 가이드

API 연동을 위한 로그인 및 회원가입 기능이 구현되었습니다.

## 📁 생성된 파일 구조

```
src/
├── types/
│   └── auth.ts                    # 인증 관련 타입 정의
├── lib/
│   ├── api/
│   │   ├── client.ts              # Axios 클라이언트 설정
│   │   └── auth.ts                # 인증 API 함수들
│   └── utils/
│       └── authHelpers.ts         # 인증 유틸리티 함수들
└── components/
    └── LoginPage.tsx              # 로그인/회원가입 페이지 (업데이트됨)
```

## 🔧 환경 설정

### 1. 환경 변수 설정

`.env` 파일에 API 서버 주소를 설정하세요:

```bash
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### 2. 의존성 설치

이미 설치되었습니다:
- `axios`: HTTP 클라이언트
- `react-router-dom`: 라우팅

## 📡 구현된 API 기능

### 1. 인증 API (`src/lib/api/auth.ts`)

#### 회원가입
- `register(data)`: 회원가입
- `checkEmailAvailability(email)`: 이메일 중복 확인

#### 로그인
- `login(data)`: 로그인
- `logout()`: 로그아웃
- `getCurrentUser()`: 현재 사용자 정보 조회

#### 토큰 관리
- `refreshToken(token)`: 토큰 갱신
- `saveTokens(tokens)`: 토큰 저장
- `getAccessToken()`: Access Token 조회
- `getRefreshToken()`: Refresh Token 조회
- `clearTokens()`: 토큰 삭제
- `isAuthenticated()`: 로그인 상태 확인

#### 비밀번호 관리
- `forgotPassword(email)`: 비밀번호 재설정 요청
- `resetPassword(data)`: 비밀번호 재설정
- `changePassword(data)`: 비밀번호 변경

#### OAuth
- `initiateOAuthLogin(provider)`: OAuth 로그인 시작
  - 지원 Provider: `google`, `kakao`, `naver`

### 2. 유틸리티 함수 (`src/lib/utils/authHelpers.ts`)

#### 검증 함수
- `validateEmail(email)`: 이메일 형식 검증
- `validatePassword(password)`: 비밀번호 강도 검증
- `validatePasswordConfirm(password, confirm)`: 비밀번호 확인
- `validateNickname(nickname)`: 닉네임 검증

#### 에러 처리
- `getAuthErrorMessage(code)`: 에러 코드를 사용자 메시지로 변환

#### Rate Limit 관리
- `saveLoginAttempt()`: 로그인 시도 저장
- `isRateLimitExceeded()`: Rate Limit 초과 확인
- `clearLoginAttempts()`: 로그인 시도 초기화

#### Remember Me
- `saveRememberMe(email)`: 이메일 기억하기
- `getRememberedEmail()`: 기억된 이메일 조회
- `clearRememberMe()`: 기억된 이메일 삭제

## 🎨 LoginPage 기능

### 1. 로그인 폼
- 이메일/비밀번호 입력
- 이메일 기억하기 (Remember Me)
- 비밀번호 찾기 링크
- Rate Limit 보호 (15분에 5회)

### 2. 회원가입 폼
- 이메일 중복 확인 버튼
- 비밀번호 강도 표시 (약함/보통/강함)
- 비밀번호 확인
- 닉네임 입력 (2~20자)
- 직업 선택 (13개 카테고리)
- 이용약관 동의

### 3. OAuth 로그인
- Google 로그인
- Kakao 로그인
- Naver 로그인

### 4. 비밀번호 재설정
- 이메일로 재설정 링크 요청
- URL 토큰으로 비밀번호 재설정

## 🔐 보안 기능

### 1. 자동 토큰 갱신
API 클라이언트는 401 에러 발생 시 자동으로 토큰을 갱신합니다.

```typescript
// src/lib/api/client.ts
// Response interceptor가 자동으로 처리
```

### 2. 비밀번호 검증
- 8자 이상
- 대문자 포함
- 소문자 포함
- 숫자 포함
- 특수문자 포함

### 3. Rate Limiting
- 로그인: 15분에 5회 제한
- localStorage에 시도 횟수 저장

## 📝 사용 예시

### 1. 로그인

```typescript
import { login } from '../lib/api/auth';

const handleLogin = async () => {
  try {
    const response = await login({
      email: 'user@example.com',
      password: 'SecurePass123!'
    });
    // 토큰은 자동으로 localStorage에 저장됨
    console.log('로그인 성공:', response.data.user);
  } catch (error) {
    console.error('로그인 실패:', error);
  }
};
```

### 2. 회원가입

```typescript
import { register, checkEmailAvailability } from '../lib/api/auth';

// 이메일 중복 확인
const checkEmail = async () => {
  const response = await checkEmailAvailability('user@example.com');
  console.log('사용 가능:', response.data.available);
};

// 회원가입
const handleRegister = async () => {
  const response = await register({
    email: 'user@example.com',
    password: 'SecurePass123!',
    nickname: '사용자닉네임',
    job_category_id: 1
  });
  console.log('회원가입 성공:', response.data.user);
};
```

### 3. 현재 사용자 정보 조회

```typescript
import { getCurrentUser, isAuthenticated } from '../lib/api/auth';

if (isAuthenticated()) {
  const user = await getCurrentUser();
  console.log('현재 사용자:', user);
}
```

### 4. OAuth 로그인

```typescript
import { initiateOAuthLogin } from '../lib/api/auth';

// Google 로그인
initiateOAuthLogin('google');

// Kakao 로그인
initiateOAuthLogin('kakao');

// Naver 로그인
initiateOAuthLogin('naver');
```

## 🎯 API 엔드포인트

모든 API는 `/api/v1` 프리픽스를 사용합니다:

- `POST /auth/register` - 회원가입
- `GET /auth/check-email` - 이메일 중복 확인
- `POST /auth/login` - 로그인
- `POST /auth/logout` - 로그아웃
- `POST /auth/refresh` - 토큰 갱신
- `GET /auth/me` - 현재 사용자 정보
- `POST /auth/forgot-password` - 비밀번호 재설정 요청
- `POST /auth/reset-password` - 비밀번호 재설정
- `POST /auth/change-password` - 비밀번호 변경
- `GET /auth/google` - Google OAuth
- `GET /auth/kakao` - Kakao OAuth
- `GET /auth/naver` - Naver OAuth

## 🚀 테스트 방법

### 1. API 서버 실행

백엔드 서버가 `http://localhost:3000`에서 실행 중이어야 합니다.

### 2. 프론트엔드 실행

```bash
npm run dev
```

### 3. 로그인 페이지 접속

브라우저에서 로그인 페이지로 이동하여 테스트합니다.

## 📋 에러 코드

### 회원가입 에러
- `1001`: 이미 사용 중인 이메일
- `1002`: 이미 사용 중인 닉네임
- `1003`: 비밀번호 강도 검증 실패
- `1004`: 잘못된 이메일 형식

### 로그인 에러
- `2001`: 잘못된 인증 정보
- `2002`: 계정을 찾을 수 없음
- `2003`: 계정 잠금 (5회 실패)

### 토큰 에러
- `3001`: 토큰 만료
- `3002`: 잘못된 토큰

## 🔍 디버깅

### localStorage 확인

개발자 도구 > Application > Local Storage에서 확인:
- `accessToken`: JWT Access Token
- `refreshToken`: JWT Refresh Token
- `tokenExpiresIn`: 토큰 만료 시간
- `rememberedEmail`: 기억된 이메일
- `loginAttempts`: 로그인 시도 횟수

### 네트워크 요청 확인

개발자 도구 > Network 탭에서 API 요청/응답 확인

## 📚 추가 참고 사항

1. **토큰 자동 갱신**: API 클라이언트가 401 에러 시 자동으로 토큰을 갱신합니다.
2. **에러 처리**: 모든 API 에러는 `getAuthErrorMessage()`로 사용자 친화적 메시지로 변환됩니다.
3. **타입 안정성**: TypeScript로 모든 타입이 정의되어 있습니다.
4. **폼 검증**: 클라이언트 측에서 실시간으로 입력을 검증합니다.

## 🎨 커스터마이징

### API Base URL 변경

`.env` 파일을 수정하세요:

```bash
VITE_API_BASE_URL=https://api.yourdomain.com/api/v1
```

### OAuth 제공자 추가/제거

`src/lib/utils/authHelpers.ts`의 `OAUTH_CONFIGS`를 수정하세요.

### 에러 메시지 변경

`src/lib/utils/authHelpers.ts`의 `getAuthErrorMessage()` 함수를 수정하세요.

## ✅ 체크리스트

- [x] 타입 정의 생성 (`src/types/auth.ts`)
- [x] API 클라이언트 설정 (`src/lib/api/client.ts`)
- [x] 인증 API 구현 (`src/lib/api/auth.ts`)
- [x] 유틸리티 함수 구현 (`src/lib/utils/authHelpers.ts`)
- [x] LoginPage 업데이트
- [x] 환경 변수 설정
- [x] 의존성 설치

## 🎉 완료!

API 연동이 완료되었습니다. 이제 백엔드 서버와 통신하여 로그인 및 회원가입 기능을 사용할 수 있습니다.
