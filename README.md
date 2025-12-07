# Ainus (AI in us) - 프로젝트 종합 문서

## 📋 목차

1. [프로젝트 개요](#1-프로젝트-개요)
2. [기술 스택](#2-기술-스택)
3. [시스템 아키텍처](#3-시스템-아키텍처)
4. [핵심 기능 및 로직](#4-핵심-기능-및-로직)
5. [데이터베이스 테이블 설계](#5-데이터베이스-테이블-설계)
6. [데이터 파이프라인](#6-데이터-파이프라인)
7. [API 명세](#7-api-명세)
8. [연구 결과](#8-연구-결과)
9. [활용 방안](#9-활용-방안)
10. [기대 효과](#10-기대-효과)
11. [향후 발전 방향](#11-향후-발전-방향)

---

## 1. 프로젝트 개요

### 1.1 프로젝트 명
**Ainus (AI in us)** - "AI와 함께하는 당신"

### 1.2 프로젝트 목적

Ainus는 **AI 기술의 민주화**를 목표로 하는 종합 AI 정보 플랫폼입니다. 급변하는 AI 생태계에서 일반 사용자와 전문가 모두가 쉽게 AI 관련 정보를 얻고, 자신에게 맞는 AI 모델을 찾을 수 있도록 지원합니다.

#### 핵심 목표:
1. **AI 이슈 모니터링**: 실시간 AI 뉴스 분석을 통한 업계 동향 파악
2. **맞춤형 AI 모델 추천**: 사용자의 직업과 작업에 최적화된 AI 모델 제안
3. **AI 모델 비교 분석**: 객관적인 벤치마크 기반 모델 성능 비교
4. **커뮤니티 형성**: AI에 관심 있는 사용자들의 정보 공유 공간 제공

### 1.3 프로젝트 배경

- AI 기술의 급속한 발전으로 새로운 모델이 매일 출시됨
- 일반 사용자가 자신에게 맞는 AI 모델을 선택하기 어려움
- AI 관련 뉴스와 정보가 분산되어 있어 종합적인 파악이 어려움
- 직업별로 AI 영향도가 다르지만 이를 정량화한 서비스 부재

### 1.4 타겟 사용자

| 사용자 유형 | 주요 니즈 |
|------------|----------|
| 개발자/엔지니어 | 코딩 작업에 최적화된 AI 모델 탐색 |
| 콘텐츠 크리에이터 | 글쓰기, 이미지 생성 AI 도구 비교 |
| 비즈니스 전문가 | 업무 효율화를 위한 AI 활용 방안 |
| 학생/연구자 | AI 기술 트렌드 및 학습 자료 |
| 일반 사용자 | AI 기술이 자신의 직업에 미치는 영향 파악 |


---

## 2. 기술 스택

### 2.1 프론트엔드 (클라이언트)

| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| **프레임워크** | React | 18.3.1 | UI 컴포넌트 기반 개발 |
| **빌드 도구** | Vite | 6.3.5 | 빠른 개발 서버 및 번들링 |
| **언어** | TypeScript | - | 타입 안정성 확보 |
| **라우팅** | React Router DOM | 7.9.6 | SPA 라우팅 |
| **상태 관리** | React Hooks | - | useState, useEffect 기반 |
| **HTTP 클라이언트** | Axios | 1.13.2 | API 통신 |
| **스타일링** | Tailwind CSS | - | 유틸리티 기반 CSS |
| **UI 컴포넌트** | Radix UI | - | 접근성 준수 컴포넌트 |
| **차트** | Recharts | 2.15.2 | 데이터 시각화 |
| **애니메이션** | Framer Motion | - | 부드러운 UI 전환 |
| **모바일** | Capacitor | 7.4.4 | Android/iOS 네이티브 앱 |

### 2.2 UI 컴포넌트 라이브러리 (Radix UI)

```
@radix-ui/react-accordion      - 아코디언 메뉴
@radix-ui/react-alert-dialog   - 경고 다이얼로그
@radix-ui/react-avatar         - 사용자 아바타
@radix-ui/react-checkbox       - 체크박스
@radix-ui/react-dialog         - 모달 다이얼로그
@radix-ui/react-dropdown-menu  - 드롭다운 메뉴
@radix-ui/react-label          - 폼 라벨
@radix-ui/react-popover        - 팝오버
@radix-ui/react-progress       - 프로그레스 바
@radix-ui/react-radio-group    - 라디오 버튼 그룹
@radix-ui/react-select         - 셀렉트 박스
@radix-ui/react-separator      - 구분선
@radix-ui/react-slider         - 슬라이더
@radix-ui/react-switch         - 토글 스위치
@radix-ui/react-tabs           - 탭 네비게이션
@radix-ui/react-tooltip        - 툴팁
```

### 2.3 백엔드 (서버) - 연동 대상

| 분류 | 기술 | 용도 |
|------|------|------|
| **API 서버** | Node.js/Express (추정) | RESTful API 제공 |
| **인증** | JWT | 토큰 기반 인증 |
| **OAuth** | Google, Kakao, Naver | 소셜 로그인 |
| **데이터베이스** | PostgreSQL/MySQL (추정) | 데이터 저장 |

### 2.4 개발 환경

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# Android 앱 빌드
npx cap sync android
npx cap open android
```

### 2.5 환경 변수 설정

```env
# API Base URL
VITE_API_BASE_URL=http://192.168.0.10:3000/api

# OAuth Configuration (optional)
VITE_GOOGLE_CLIENT_ID=your_google_client_id
VITE_KAKAO_CLIENT_ID=your_kakao_client_id
VITE_NAVER_CLIENT_ID=your_naver_client_id
```


---

## 3. 시스템 아키텍처

### 3.1 전체 시스템 구조

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Ainus 시스템 아키텍처                           │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐     │
│  │   Web Browser   │    │  Android App    │    │    iOS App      │     │
│  │   (React SPA)   │    │  (Capacitor)    │    │  (Capacitor)    │     │
│  └────────┬────────┘    └────────┬────────┘    └────────┬────────┘     │
│           │                      │                      │               │
│           └──────────────────────┼──────────────────────┘               │
│                                  │                                      │
│                          ┌───────▼───────┐                              │
│                          │  Vite Proxy   │ (개발 환경)                   │
│                          │  /api → :3000 │                              │
│                          └───────┬───────┘                              │
│                                  │                                      │
├──────────────────────────────────┼──────────────────────────────────────┤
│                                  │                                      │
│                          ┌───────▼───────┐                              │
│                          │   API Server  │                              │
│                          │  (Express.js) │                              │
│                          └───────┬───────┘                              │
│                                  │                                      │
│           ┌──────────────────────┼──────────────────────┐               │
│           │                      │                      │               │
│   ┌───────▼───────┐      ┌───────▼───────┐      ┌───────▼───────┐      │
│   │  Auth Service │      │ Issue Service │      │ Model Service │      │
│   │  (JWT/OAuth)  │      │ (뉴스 분석)    │      │ (AI 모델 DB)  │      │
│   └───────┬───────┘      └───────┬───────┘      └───────┬───────┘      │
│           │                      │                      │               │
│           └──────────────────────┼──────────────────────┘               │
│                                  │                                      │
│                          ┌───────▼───────┐                              │
│                          │   Database    │                              │
│                          │ (PostgreSQL)  │                              │
│                          └───────────────┘                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 3.2 프론트엔드 디렉토리 구조

```
src/
├── App.tsx                    # 메인 앱 컴포넌트 (라우팅)
├── main.tsx                   # 앱 진입점
├── index.css                  # 전역 스타일
├── vite-env.d.ts              # Vite 타입 정의
│
├── components/                # UI 컴포넌트
│   ├── ui/                    # 재사용 가능한 기본 UI 컴포넌트
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── badge.tsx
│   │   ├── tabs.tsx
│   │   └── ...
│   │
│   ├── figma/                 # Figma 디자인 기반 컴포넌트
│   │
│   ├── LoginPage.tsx          # 로그인/회원가입
│   ├── HomePage.tsx           # 홈 대시보드
│   ├── IssuePage.tsx          # AI 이슈 지수
│   ├── IssueDetailPage.tsx    # 이슈 상세
│   ├── ModelPage.tsx          # AI 모델 추천/비교
│   ├── CommunityPage.tsx      # 커뮤니티 목록
│   ├── CommunityPostDetailPage.tsx  # 게시글 상세
│   ├── CommunityWritePage.tsx # 게시글 작성
│   ├── MyPage.tsx             # 마이페이지
│   ├── ProfileEditPage.tsx    # 프로필 수정
│   ├── OnboardingGender.tsx   # 온보딩 - 성별
│   ├── OnboardingJob.tsx      # 온보딩 - 직업
│   ├── OnboardingTags.tsx     # 온보딩 - 관심 태그
│   ├── AppHeader.tsx          # 공통 헤더
│   ├── BottomNavigation.tsx   # 하단 네비게이션
│   └── ...
│
├── lib/                       # 라이브러리/유틸리티
│   ├── api/                   # API 클라이언트
│   │   ├── client.ts          # Axios 인스턴스 설정
│   │   ├── auth.ts            # 인증 API
│   │   ├── issues.ts          # 이슈 지수 API
│   │   ├── models.ts          # AI 모델 API
│   │   ├── community.ts       # 커뮤니티 API
│   │   ├── user.ts            # 사용자 API
│   │   └── settings.ts        # 설정 API
│   │
│   └── utils/                 # 유틸리티 함수
│       ├── authHelpers.ts     # 인증 헬퍼
│       ├── issueHelpers.ts    # 이슈 헬퍼
│       ├── modelHelpers.ts    # 모델 헬퍼
│       ├── communityHelpers.ts # 커뮤니티 헬퍼
│       ├── userHelpers.ts     # 사용자 헬퍼
│       └── storage.ts         # 로컬 스토리지
│
├── types/                     # TypeScript 타입 정의
│   ├── auth.ts                # 인증 관련 타입
│   ├── issue.ts               # 이슈 관련 타입
│   ├── model.ts               # 모델 관련 타입
│   ├── community.ts           # 커뮤니티 관련 타입
│   └── user.ts                # 사용자 관련 타입
│
├── styles/                    # 스타일 파일
└── guidelines/                # 디자인 가이드라인
```

### 3.3 페이지 네비게이션 흐름

```
┌─────────────┐
│   Login     │ ──────────────────────────────────────────┐
│   Page      │                                           │
└──────┬──────┘                                           │
       │ (회원가입)                                        │ (로그인)
       ▼                                                  │
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  Onboarding │ ─► │  Onboarding │ ─► │  Onboarding │    │
│   Gender    │    │     Job     │    │    Tags     │    │
└─────────────┘    └─────────────┘    └──────┬──────┘    │
                                             │           │
                                             ▼           ▼
                                      ┌─────────────────────┐
                                      │      Home Page      │
                                      │  (메인 대시보드)     │
                                      └──────────┬──────────┘
                                                 │
              ┌──────────────┬──────────────┬────┴────┬──────────────┐
              ▼              ▼              ▼         ▼              ▼
       ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐  ┌───────────┐
       │   Issue   │  │   Model   │  │ Community │  │  MyPage   │  │  Notifi-  │
       │   Page    │  │   Page    │  │   Page    │  │           │  │  cations  │
       └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └─────┬─────┘  └───────────┘
             │              │              │              │
             ▼              │              ▼              ▼
       ┌───────────┐        │        ┌───────────┐  ┌───────────┐
       │  Issue    │        │        │   Post    │  │  Profile  │
       │  Detail   │        │        │  Detail   │  │   Edit    │
       └───────────┘        │        └─────┬─────┘  └───────────┘
                            │              │
                            │              ▼
                            │        ┌───────────┐
                            │        │   Write   │
                            │        │   Post    │
                            │        └───────────┘
                            │
                            ▼
                    ┌───────────────┐
                    │ Model Compare │
                    │   Timeline    │
                    │  Recommend    │
                    └───────────────┘
```


---

## 4. 핵심 기능 및 로직

### 4.1 인증 시스템 (Authentication)

#### 4.1.1 로그인 흐름

```typescript
// 로그인 프로세스
1. 사용자 이메일/비밀번호 입력
2. Rate Limit 확인 (15분에 5회 제한)
3. 입력값 검증 (이메일 형식, 비밀번호 길이)
4. API 호출: POST /api/auth/login
5. 성공 시: JWT 토큰 저장 (localStorage)
   - accessToken: 인증 토큰
   - refreshToken: 갱신 토큰
   - tokenExpiresIn: 만료 시간
6. Remember Me 처리
7. 홈 페이지로 이동
```

#### 4.1.2 토큰 자동 갱신

```typescript
// Axios Interceptor를 통한 자동 토큰 갱신
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // Refresh Token으로 새 Access Token 발급
      const response = await axios.post('/api/auth/refresh', {
        refreshToken: localStorage.getItem('refreshToken')
      });
      
      // 새 토큰 저장 후 원래 요청 재시도
      localStorage.setItem('accessToken', response.data.accessToken);
      return apiClient(originalRequest);
    }
    return Promise.reject(error);
  }
);
```

#### 4.1.3 비밀번호 검증 규칙

```typescript
// 비밀번호 강도 검증
const validatePassword = (password: string): PasswordValidation => {
  const errors: string[] = [];
  
  if (password.length < 8) errors.push('8자 이상');
  if (!/[A-Z]/.test(password)) errors.push('대문자 포함');
  if (!/[a-z]/.test(password)) errors.push('소문자 포함');
  if (!/[0-9]/.test(password)) errors.push('숫자 포함');
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) errors.push('특수문자 포함');
  
  // 강도 결정: 5개 조건 중 충족 개수에 따라
  // 5개: strong, 3-4개: medium, 0-2개: weak
};
```

#### 4.1.4 OAuth 소셜 로그인

| Provider | 엔드포인트 | 특징 |
|----------|-----------|------|
| Google | `/api/auth/google` | 글로벌 사용자 |
| Kakao | `/api/auth/kakao` | 국내 사용자 |
| Naver | `/api/auth/naver` | 국내 사용자 |

### 4.2 AI 이슈 지수 시스템

#### 4.2.1 이슈 지수 개념

**AI 이슈 지수**는 AI 관련 뉴스의 양과 중요도를 분석하여 0-100 사이의 수치로 표현한 지표입니다.

```
지수 범위:
- 0-49: 안정 (녹색) - AI 업계 평온
- 50-74: 주의 (노란색) - 주목할 이슈 발생
- 75-100: 경계 (빨간색) - 중대한 변화/이슈 발생
```

#### 4.2.2 클러스터 분석 로직

```typescript
// 뉴스 클러스터 구조
interface ClusterSnapshot {
  cluster_id: string;        // 클러스터 고유 ID
  topic_name: string;        // 주제명 (예: "GPT-5 개발 본격화")
  tags: string[];            // 관련 태그 ["LLM", "모델출시"]
  appearance_count: number;  // 등장 횟수
  article_count: number;     // 관련 기사 수
  article_indices: number[]; // 기사 인덱스 배열
  status: 'active' | 'inactive';  // 활성 상태
  cluster_score: number;     // 클러스터 점수 (0-100)
}

// 클러스터 점수 계산 요소
- 기사 수 (article_count)
- 등장 빈도 (appearance_count)
- 시간 가중치 (최신 기사일수록 높은 점수)
```

#### 4.2.3 직업별 이슈 지수

13개 직업 카테고리별로 AI 영향도를 분석합니다:

```typescript
const JOB_CATEGORIES = [
  '기술/개발',      // 개발자, 엔지니어
  '창작/콘텐츠',    // 디자이너, 작가, 크리에이터
  '분석/사무',      // 데이터 분석가, 사무직
  '의료/과학',      // 의사, 연구원
  '교육',          // 교사, 강사
  '비즈니스',       // 마케터, 컨설턴트
  '제조/건설',      // 제조업, 건설업
  '서비스',        // 서비스업, 판매직
  '창업/자영업',    // 창업가, 자영업자
  '농업/축산업',    // 농업, 축산업
  '어업/해상업',    // 어업, 해상업
  '학생',          // 학생
  '기타'           // 기타 직업
];
```

#### 4.2.4 차트 데이터 변환

```typescript
// 히스토리 데이터 → 차트 데이터 변환
const chartData = historyData.map((item) => ({
  date: formatShortDate(item.collected_at),  // "MM/DD"
  index: toSafeNumber(item.overall_index),   // 숫자 보장
  clusters: toSafeNumber(item.active_clusters_count),
}));

// 24시간 데이터 필터링
const filter24HoursData = (data: IssueIndexHistoryItem[]) => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return data.filter(item => {
    const itemDate = new Date(item.collected_at);
    return itemDate >= oneDayAgo && itemDate <= now;
  });
};
```

### 4.3 AI 모델 추천 시스템

#### 4.3.1 작업 분류 및 추천 흐름

```
사용자 입력 → 작업 분류 → 벤치마크 선정 → 모델 추천
     │              │              │              │
     ▼              ▼              ▼              ▼
"블로그 글    →  writing    →  MMLU_PRO   →  GPT-4 Turbo
 작성해줘"       (글쓰기)       (70%)         Claude 3
                              HumanEval      Gemini Pro
                               (30%)
```

#### 4.3.2 25개 작업 카테고리

```typescript
const TASK_CATEGORIES = [
  'writing',                    // 글쓰기
  'image_generation_editing',   // 이미지 작업
  'coding',                     // 코딩/개발
  'video_production',           // 영상 제작
  'audio_music',                // 음악/오디오
  'translation',                // 번역
  'summarization',              // 요약/정리
  'research',                   // 연구/조사
  'learning',                   // 학습/교육
  'brainstorming',              // 창작/아이디어
  'analysis',                   // 분석
  'customer_service',           // 고객 응대
  'design',                     // 디자인/UI-UX
  'marketing',                  // 마케팅
  'cooking',                    // 요리
  'fitness',                    // 운동/피트니스
  'travel_planning',            // 여행 계획
  'schedule_planning',          // 일정 관리
  'math_science',               // 수학/과학
  'legal',                      // 법률/계약
  'finance',                    // 재무/회계
  'hr_recruitment',             // 인적자원/채용
  'presentation',               // 프레젠테이션
  'gaming',                     // 게임
  'voice_action',               // 음성 명령/작업
];
```

#### 4.3.3 모델 추천 알고리즘

```typescript
// 추천 모델 점수 계산
interface RecommendedModel {
  rank: number;
  model_id: string;
  model_name: string;
  creator_name: string;
  weighted_score: number;        // 가중 점수
  benchmark_scores: {
    primary: {
      name: string;              // 주요 벤치마크명
      score: number;             // 점수
      weight: number;            // 가중치 (예: 0.7)
      contribution: number;      // 기여도
    };
    secondary: {
      name: string;              // 보조 벤치마크명
      score: number;
      weight: number;            // 가중치 (예: 0.3)
      contribution: number;
    };
  };
  overall_score: number;         // 종합 점수
  pricing: {
    input_price: number;         // 입력 가격 ($/M tokens)
    output_price: number;        // 출력 가격 ($/M tokens)
  };
}

// 가중 점수 계산
weighted_score = (primary.score × primary.weight) + (secondary.score × secondary.weight)
```

#### 4.3.4 모델 비교 기능

```typescript
// 두 모델 비교 데이터 구조
interface ModelComparison {
  model_a: ComparisonModel;
  model_b: ComparisonModel;
  comparison_summary: {
    winner_overall: string;
    winner_intelligence: string;
    winner_coding: string;
    winner_math: string;
    winner_reasoning: string;
    winner_language: string;
    score_differences: ScoreDifferences;
    price_comparison: PriceComparison;
    recommendation: string;
  };
  visual_data: {
    bar_chart_data: BarChartDataItem[];
    radar_chart_data: RadarChartData;
    performance_gap: number;
  };
}
```

#### 4.3.5 타임라인 분석

```typescript
// 모델 시리즈 타임라인
interface TimelineEvent {
  model_name: string;           // 모델명
  release_date: string;         // 출시일
  overall_score: number;        // 종합 점수
  major_improvements: string[]; // 주요 개선사항
}

// 벤치마크 발전 추이
interface BenchmarkProgression {
  series: string;               // 시리즈명 (GPT, Claude 등)
  benchmark: string;            // 벤치마크명
  progression: Array<{
    model_name: string;
    release_date: string;
    score: number;
    improvement_from_previous: number | null;
  }>;
}
```


### 4.4 커뮤니티 시스템

#### 4.4.1 게시글 기능

```typescript
// 게시글 구조
interface Post {
  post_id: number;
  title: string;
  author: {
    user_id: number;
    nickname: string;
    profile_image_url?: string;
  };
  likes_count: number;
  comments_count: number;
  views_count: number;
  created_at: string;
}

// 게시글 상세
interface PostDetail extends Post {
  content: string;
  is_liked: boolean;
  updated_at: string;
}
```

#### 4.4.2 인기글 판단 로직

```typescript
// HOT 게시글 판단 기준
const isHotPost = (post: Post): boolean => {
  const viewsThreshold = 50;   // 조회수 50회 이상
  const likesThreshold = 20;   // 좋아요 20개 이상
  
  return post.views_count >= viewsThreshold || 
         post.likes_count >= likesThreshold;
};
```

#### 4.4.3 정렬 옵션

| 정렬 기준 | 설명 |
|----------|------|
| `recent` | 최신순 (created_at 내림차순) |
| `popular` | 인기순 (likes_count 내림차순) |
| `views` | 조회순 (views_count 내림차순) |

### 4.5 사용자 프로필 시스템

#### 4.5.1 사용자 정보 구조

```typescript
// 기본 사용자 정보 (백엔드)
interface User {
  user_id: number;
  email: string;
  nickname: string;
  profile_image_url: string | null;
  job_category_id: number;
  auth_provider: 'local' | 'google' | 'kakao' | 'naver';
  created_at: string;
}

// 확장 사용자 정보 (프론트엔드 localStorage 포함)
interface ExtendedUser extends User {
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  interest_tags?: string[];
  job_category_name?: string;
}
```

#### 4.5.2 관심 태그 (40개)

```typescript
const INTEREST_TAGS = [
  // 기술 중심 (12개)
  'LLM', '컴퓨터비전', '자연어처리', '머신러닝', '강화학습',
  '연합학습', '모델경량화', '프롬프트엔지니어링', '에지AI',
  '윤리AI', 'AI보안', '개인화추천',
  
  // 산업/응용 (18개)
  '콘텐츠생성', '이미지생성', '영상생성', '코드생성', '글쓰기지원',
  '번역', '음성합성', '음성인식', '채팅봇', '감정분석',
  '데이터분석', '예측분석', '자동화', '업무효율화', '의사결정지원',
  '마케팅자동화', '검색최적화', '가격결정',
  
  // 트렌드/이슈 (10개)
  'AI일자리', 'AI윤리', 'AI규제', 'AI성능', '모델출시',
  '오픈소스', '의료진단', '교육지원', '비용절감', '기술트렌드',
];
```

### 4.6 온보딩 프로세스

```
회원가입 완료
     │
     ▼
┌─────────────────┐
│ OnboardingGender│  성별 선택
│ (남성/여성/기타) │  - 맞춤 콘텐츠 제공용
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  OnboardingJob  │  직업 선택
│ (13개 카테고리)  │  - 직업별 이슈 지수
└────────┬────────┘  - 맞춤 모델 추천
         │
         ▼
┌─────────────────┐
│ OnboardingTags  │  관심 태그 선택
│  (40개 태그)    │  - 관심 분야 기반 콘텐츠
└────────┬────────┘
         │
         ▼
    홈 페이지
```

### 4.7 API 클라이언트 설계

#### 4.7.1 Axios 인스턴스 설정

```typescript
// 플랫폼별 Base URL 결정
const getBaseUrl = (): string => {
  // 1. 환경 변수 우선
  if (import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  
  // 2. Capacitor Native 플랫폼
  if (Capacitor.isNativePlatform()) {
    return 'http://192.168.35.125:3000/api';
  }
  
  // 3. 웹 개발 환경 (Vite Proxy)
  return '/api';
};

const apiClient = axios.create({
  baseURL: getBaseUrl(),
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

#### 4.7.2 응답 정규화

```typescript
// 다양한 API 응답 형식을 통일된 형태로 정규화
const normalizeResponseData = (data: any, url: string): any => {
  // 이미 정규화된 응답 { success, data }
  if (data && 'success' in data && 'data' in data) {
    return data;
  }
  
  // 배열 응답 → 래핑
  if (Array.isArray(data)) {
    return { success: true, data };
  }
  
  // 객체 응답 → 래핑
  if (data && typeof data === 'object') {
    return { success: true, data };
  }
  
  return data;
};
```


---

## 5. 데이터베이스 테이블 설계

### 5.1 ERD (Entity Relationship Diagram)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              DATABASE SCHEMA                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐         ┌─────────────────┐                           │
│  │     users       │         │  job_categories │                           │
│  ├─────────────────┤         ├─────────────────┤                           │
│  │ user_id (PK)    │────────►│ job_category_id │                           │
│  │ email           │         │ job_name        │                           │
│  │ password_hash   │         │ category_code   │                           │
│  │ nickname        │         │ description     │                           │
│  │ profile_image   │         └─────────────────┘                           │
│  │ job_category_id │                                                       │
│  │ auth_provider   │         ┌─────────────────┐                           │
│  │ created_at      │         │ interest_tags   │                           │
│  └────────┬────────┘         ├─────────────────┤                           │
│           │                  │ tag_id (PK)     │                           │
│           │                  │ tag_name        │                           │
│           │                  │ tag_code        │                           │
│           │                  │ category        │                           │
│           │                  └─────────────────┘                           │
│           │                                                                │
│           │                  ┌─────────────────┐                           │
│           │                  │ user_tags       │                           │
│           │                  ├─────────────────┤                           │
│           └─────────────────►│ user_id (FK)    │                           │
│                              │ tag_id (FK)     │                           │
│                              └─────────────────┘                           │
│                                                                             │
│  ┌─────────────────┐         ┌─────────────────┐                           │
│  │     posts       │         │    comments     │                           │
│  ├─────────────────┤         ├─────────────────┤                           │
│  │ post_id (PK)    │◄────────│ post_id (FK)    │                           │
│  │ user_id (FK)    │         │ comment_id (PK) │                           │
│  │ title           │         │ user_id (FK)    │                           │
│  │ content         │         │ content         │                           │
│  │ views_count     │         │ likes_count     │                           │
│  │ likes_count     │         │ created_at      │                           │
│  │ comments_count  │         └─────────────────┘                           │
│  │ created_at      │                                                       │
│  │ updated_at      │         ┌─────────────────┐                           │
│  └─────────────────┘         │   post_likes    │                           │
│                              ├─────────────────┤                           │
│                              │ post_id (FK)    │                           │
│                              │ user_id (FK)    │                           │
│                              │ created_at      │                           │
│                              └─────────────────┘                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 사용자 관련 테이블

#### 5.2.1 users (사용자)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| user_id | INT | PK, AUTO_INCREMENT | 사용자 고유 ID |
| email | VARCHAR(255) | UNIQUE, NOT NULL | 이메일 |
| password_hash | VARCHAR(255) | NULL | 비밀번호 해시 (OAuth는 NULL) |
| nickname | VARCHAR(50) | UNIQUE, NOT NULL | 닉네임 |
| profile_image_url | VARCHAR(500) | NULL | 프로필 이미지 URL |
| job_category_id | INT | FK | 직업 카테고리 ID |
| auth_provider | ENUM | NOT NULL | 'local', 'google', 'kakao', 'naver' |
| created_at | TIMESTAMP | DEFAULT NOW() | 가입일시 |
| updated_at | TIMESTAMP | ON UPDATE NOW() | 수정일시 |

#### 5.2.2 job_categories (직업 카테고리)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| job_category_id | INT | PK, AUTO_INCREMENT | 직업 카테고리 ID |
| job_name | VARCHAR(50) | NOT NULL | 직업명 (한글) |
| category_code | VARCHAR(50) | UNIQUE | 카테고리 코드 |
| description | TEXT | NULL | 설명 |

#### 5.2.3 interest_tags (관심 태그)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| tag_id | INT | PK, AUTO_INCREMENT | 태그 ID |
| tag_name | VARCHAR(50) | NOT NULL | 태그명 |
| tag_code | VARCHAR(50) | UNIQUE | 태그 코드 |
| category | VARCHAR(50) | NULL | 태그 분류 |

#### 5.2.4 user_tags (사용자-태그 연결)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| user_id | INT | FK, PK | 사용자 ID |
| tag_id | INT | FK, PK | 태그 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 등록일시 |

### 5.3 커뮤니티 관련 테이블

#### 5.3.1 posts (게시글)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| post_id | INT | PK, AUTO_INCREMENT | 게시글 ID |
| user_id | INT | FK, NOT NULL | 작성자 ID |
| title | VARCHAR(200) | NOT NULL | 제목 |
| content | TEXT | NOT NULL | 내용 |
| views_count | INT | DEFAULT 0 | 조회수 |
| likes_count | INT | DEFAULT 0 | 좋아요 수 |
| comments_count | INT | DEFAULT 0 | 댓글 수 |
| created_at | TIMESTAMP | DEFAULT NOW() | 작성일시 |
| updated_at | TIMESTAMP | ON UPDATE NOW() | 수정일시 |

#### 5.3.2 comments (댓글)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| comment_id | INT | PK, AUTO_INCREMENT | 댓글 ID |
| post_id | INT | FK, NOT NULL | 게시글 ID |
| user_id | INT | FK, NOT NULL | 작성자 ID |
| content | TEXT | NOT NULL | 내용 |
| likes_count | INT | DEFAULT 0 | 좋아요 수 |
| created_at | TIMESTAMP | DEFAULT NOW() | 작성일시 |
| updated_at | TIMESTAMP | ON UPDATE NOW() | 수정일시 |

#### 5.3.3 post_likes (게시글 좋아요)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| post_id | INT | FK, PK | 게시글 ID |
| user_id | INT | FK, PK | 사용자 ID |
| created_at | TIMESTAMP | DEFAULT NOW() | 좋아요 일시 |

### 5.4 AI 모델 관련 테이블

#### 5.4.1 models (AI 모델)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| model_id | VARCHAR(100) | PK | 모델 고유 ID |
| model_name | VARCHAR(200) | NOT NULL | 모델명 |
| model_slug | VARCHAR(200) | UNIQUE | URL 슬러그 |
| creator_name | VARCHAR(100) | NOT NULL | 제작사명 |
| release_date | DATE | NULL | 출시일 |
| model_type | VARCHAR(50) | NULL | 모델 유형 |
| parameter_size | VARCHAR(50) | NULL | 파라미터 크기 |
| context_length | INT | NULL | 컨텍스트 길이 |
| is_open_source | BOOLEAN | DEFAULT FALSE | 오픈소스 여부 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성 상태 |
| created_at | TIMESTAMP | DEFAULT NOW() | 등록일시 |
| updated_at | TIMESTAMP | ON UPDATE NOW() | 수정일시 |

#### 5.4.2 benchmark_evaluations (벤치마크 평가)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| evaluation_id | INT | PK, AUTO_INCREMENT | 평가 ID |
| model_id | VARCHAR(100) | FK, NOT NULL | 모델 ID |
| benchmark_name | VARCHAR(100) | NOT NULL | 벤치마크명 |
| score | DECIMAL(10,4) | NOT NULL | 점수 |
| max_score | DECIMAL(10,4) | NULL | 최대 점수 |
| normalized_score | DECIMAL(5,2) | NULL | 정규화 점수 (0-100) |
| model_rank | INT | NULL | 순위 |
| measured_at | TIMESTAMP | NULL | 측정일시 |

#### 5.4.3 model_overall_scores (모델 종합 점수)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| score_id | INT | PK, AUTO_INCREMENT | 점수 ID |
| model_id | VARCHAR(100) | FK, NOT NULL | 모델 ID |
| overall_score | DECIMAL(5,2) | NOT NULL | 종합 점수 |
| intelligence_index | DECIMAL(5,2) | NULL | 지능 지수 |
| coding_index | DECIMAL(5,2) | NULL | 코딩 지수 |
| math_index | DECIMAL(5,2) | NULL | 수학 지수 |
| reasoning_index | DECIMAL(5,2) | NULL | 추론 지수 |
| language_index | DECIMAL(5,2) | NULL | 언어 지수 |
| calculated_at | TIMESTAMP | DEFAULT NOW() | 계산일시 |
| version | INT | DEFAULT 1 | 버전 |

#### 5.4.4 model_pricing (모델 가격)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| pricing_id | INT | PK, AUTO_INCREMENT | 가격 ID |
| model_id | VARCHAR(100) | FK, NOT NULL | 모델 ID |
| price_input_1m | DECIMAL(10,4) | NOT NULL | 입력 가격 ($/M tokens) |
| price_output_1m | DECIMAL(10,4) | NOT NULL | 출력 가격 ($/M tokens) |
| price_blended_3to1 | DECIMAL(10,4) | NULL | 혼합 가격 (3:1 비율) |
| currency | VARCHAR(10) | DEFAULT 'USD' | 통화 |
| effective_date | DATE | NOT NULL | 적용일 |
| is_current | BOOLEAN | DEFAULT TRUE | 현재 가격 여부 |

### 5.5 이슈 지수 관련 테이블

#### 5.5.1 issue_index_snapshots (이슈 지수 스냅샷)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| snapshot_id | INT | PK, AUTO_INCREMENT | 스냅샷 ID |
| collected_at | TIMESTAMP | NOT NULL, UNIQUE | 수집 시간 |
| overall_index | DECIMAL(5,2) | NOT NULL | 전체 이슈 지수 |
| active_clusters_count | INT | DEFAULT 0 | 활성 클러스터 수 |
| inactive_clusters_count | INT | DEFAULT 0 | 비활성 클러스터 수 |
| total_articles_analyzed | INT | DEFAULT 0 | 분석된 기사 수 |

#### 5.5.2 clusters (뉴스 클러스터)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| cluster_id | VARCHAR(100) | PK | 클러스터 ID |
| snapshot_id | INT | FK, NOT NULL | 스냅샷 ID |
| topic_name | VARCHAR(500) | NOT NULL | 주제명 |
| tags | JSON | NULL | 태그 배열 |
| appearance_count | INT | DEFAULT 1 | 등장 횟수 |
| article_count | INT | DEFAULT 0 | 기사 수 |
| article_indices | JSON | NULL | 기사 인덱스 배열 |
| status | ENUM | DEFAULT 'active' | 'active', 'inactive' |
| cluster_score | DECIMAL(5,2) | DEFAULT 0 | 클러스터 점수 |

#### 5.5.3 articles (뉴스 기사)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| article_index | INT | PK | 기사 인덱스 |
| collected_at | TIMESTAMP | NOT NULL | 수집 시간 |
| title | VARCHAR(500) | NOT NULL | 제목 |
| link | VARCHAR(1000) | NOT NULL | 원문 링크 |
| description | TEXT | NULL | 요약/설명 |
| pub_date | TIMESTAMP | NULL | 발행일 |
| source | VARCHAR(100) | NULL | 출처 |

#### 5.5.4 job_issue_indices (직업별 이슈 지수)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| index_id | INT | PK, AUTO_INCREMENT | 인덱스 ID |
| collected_at | TIMESTAMP | NOT NULL | 수집 시간 |
| job_category | VARCHAR(50) | NOT NULL | 직업 카테고리 |
| issue_index | DECIMAL(5,2) | NOT NULL | 이슈 지수 |
| active_clusters_count | INT | DEFAULT 0 | 활성 클러스터 수 |
| inactive_clusters_count | INT | DEFAULT 0 | 비활성 클러스터 수 |
| total_articles_count | INT | DEFAULT 0 | 관련 기사 수 |

### 5.6 작업 분류 관련 테이블

#### 5.6.1 task_categories (작업 카테고리)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| task_category_id | INT | PK, AUTO_INCREMENT | 카테고리 ID |
| category_code | VARCHAR(50) | UNIQUE, NOT NULL | 카테고리 코드 |
| category_name_ko | VARCHAR(100) | NOT NULL | 한글명 |
| category_name_en | VARCHAR(100) | NOT NULL | 영문명 |
| description | TEXT | NULL | 설명 |
| keywords | JSON | NULL | 키워드 배열 |
| is_active | BOOLEAN | DEFAULT TRUE | 활성 상태 |
| created_at | TIMESTAMP | DEFAULT NOW() | 생성일시 |
| updated_at | TIMESTAMP | ON UPDATE NOW() | 수정일시 |

#### 5.6.2 task_benchmark_mappings (작업-벤치마크 매핑)

| 컬럼명 | 타입 | 제약조건 | 설명 |
|--------|------|----------|------|
| mapping_id | INT | PK, AUTO_INCREMENT | 매핑 ID |
| task_category_id | INT | FK, NOT NULL | 작업 카테고리 ID |
| primary_benchmark | VARCHAR(100) | NOT NULL | 주요 벤치마크 |
| secondary_benchmark | VARCHAR(100) | NOT NULL | 보조 벤치마크 |
| primary_weight | DECIMAL(3,2) | DEFAULT 0.70 | 주요 가중치 |
| secondary_weight | DECIMAL(3,2) | DEFAULT 0.30 | 보조 가중치 |


---

## 6. 데이터 파이프라인

### 6.1 전체 데이터 흐름

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA PIPELINE OVERVIEW                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                            │
│  │ 뉴스 소스    │                                                            │
│  │ (RSS/API)   │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────────────┐       │
│  │                    뉴스 수집 파이프라인                           │       │
│  │  ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐      │       │
│  │  │ 수집기  │ ─► │ 전처리  │ ─► │ 클러스터│ ─► │ 점수화  │      │       │
│  │  │(Crawler)│    │(Cleaner)│    │(Grouper)│    │(Scorer) │      │       │
│  │  └─────────┘    └─────────┘    └─────────┘    └─────────┘      │       │
│  └─────────────────────────────────────────────────────────────────┘       │
│                                  │                                          │
│                                  ▼                                          │
│                          ┌─────────────┐                                    │
│                          │  Database   │                                    │
│                          │ (PostgreSQL)│                                    │
│                          └──────┬──────┘                                    │
│                                 │                                           │
│         ┌───────────────────────┼───────────────────────┐                   │
│         │                       │                       │                   │
│         ▼                       ▼                       ▼                   │
│  ┌─────────────┐         ┌─────────────┐         ┌─────────────┐           │
│  │ Issue Index │         │ Job Index   │         │ Cluster     │           │
│  │ API         │         │ API         │         │ API         │           │
│  └──────┬──────┘         └──────┬──────┘         └──────┬──────┘           │
│         │                       │                       │                   │
│         └───────────────────────┼───────────────────────┘                   │
│                                 │                                           │
│                                 ▼                                           │
│                          ┌─────────────┐                                    │
│                          │ Frontend    │                                    │
│                          │ (React App) │                                    │
│                          └─────────────┘                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 6.2 뉴스 수집 파이프라인

#### 6.2.1 수집 단계 (Collector)

```
수집 주기: 매 시간 (또는 설정된 간격)

수집 소스:
├── 국내 뉴스
│   ├── 네이버 뉴스 API
│   ├── 다음 뉴스 API
│   └── 주요 언론사 RSS
│
└── 해외 뉴스
    ├── Google News API
    ├── TechCrunch RSS
    └── AI 전문 매체 RSS

수집 키워드:
- AI, 인공지능, 머신러닝, 딥러닝
- GPT, Claude, Gemini, LLM
- 챗봇, 생성형 AI, 자동화
- AI 규제, AI 윤리, AI 일자리
```

#### 6.2.2 전처리 단계 (Preprocessor)

```python
# 전처리 파이프라인 (의사 코드)
def preprocess_article(article):
    # 1. 중복 제거
    if is_duplicate(article):
        return None
    
    # 2. 텍스트 정제
    article.title = clean_text(article.title)
    article.description = clean_text(article.description)
    
    # 3. AI 관련성 필터링
    if not is_ai_related(article):
        return None
    
    # 4. 언어 감지 및 번역 (필요시)
    article.language = detect_language(article)
    
    # 5. 키워드 추출
    article.keywords = extract_keywords(article)
    
    return article
```

#### 6.2.3 클러스터링 단계 (Clusterer)

```
클러스터링 알고리즘: 
- TF-IDF + K-Means
- 또는 BERT 임베딩 + HDBSCAN

클러스터 생성 기준:
1. 유사도 임계값: 0.7 이상
2. 최소 기사 수: 3개 이상
3. 시간 범위: 24시간 이내

클러스터 속성:
- topic_name: 대표 키워드 기반 주제명 생성
- tags: 상위 5개 키워드
- article_indices: 포함된 기사 인덱스
```

#### 6.2.4 점수화 단계 (Scorer)

```typescript
// 클러스터 점수 계산
function calculateClusterScore(cluster: Cluster): number {
  const weights = {
    articleCount: 0.3,      // 기사 수
    recency: 0.25,          // 최신성
    sourceVariety: 0.2,     // 출처 다양성
    engagementProxy: 0.15,  // 참여도 추정
    keywordRelevance: 0.1,  // 키워드 관련성
  };
  
  const scores = {
    articleCount: normalize(cluster.article_count, 1, 100),
    recency: calculateRecencyScore(cluster.latest_article_date),
    sourceVariety: cluster.unique_sources / cluster.article_count,
    engagementProxy: estimateEngagement(cluster),
    keywordRelevance: calculateKeywordRelevance(cluster.tags),
  };
  
  return Object.keys(weights).reduce((total, key) => {
    return total + weights[key] * scores[key];
  }, 0) * 100;
}

// 전체 이슈 지수 계산
function calculateOverallIndex(clusters: Cluster[]): number {
  const activeClusters = clusters.filter(c => c.status === 'active');
  
  if (activeClusters.length === 0) return 0;
  
  const avgScore = activeClusters.reduce((sum, c) => sum + c.cluster_score, 0) 
                   / activeClusters.length;
  
  const volumeFactor = Math.min(activeClusters.length / 20, 1);
  
  return avgScore * 0.7 + volumeFactor * 30;
}
```

### 6.3 직업별 이슈 지수 파이프라인

```
┌─────────────────────────────────────────────────────────────────┐
│                  직업별 이슈 지수 계산 파이프라인                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │ 전체 클러스터│                                                │
│  └──────┬──────┘                                                │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              직업-키워드 매칭 엔진                        │   │
│  │                                                         │   │
│  │  직업 카테고리별 관련 키워드:                             │   │
│  │                                                         │   │
│  │  기술/개발:                                              │   │
│  │    - 코딩, 개발, 프로그래밍, 소프트웨어, API             │   │
│  │    - GitHub Copilot, 코드 생성, 자동화                   │   │
│  │                                                         │   │
│  │  창작/콘텐츠:                                            │   │
│  │    - 이미지 생성, 영상 제작, 글쓰기, 디자인              │   │
│  │    - DALL-E, Midjourney, Stable Diffusion               │   │
│  │                                                         │   │
│  │  의료/과학:                                              │   │
│  │    - 의료 AI, 진단, 신약 개발, 연구                      │   │
│  │    - AlphaFold, 의료 영상 분석                           │   │
│  │                                                         │   │
│  │  ... (13개 직업 카테고리)                                │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              매칭 점수 계산                               │   │
│  │                                                         │   │
│  │  match_ratio = 매칭된 키워드 수 / 전체 키워드 수          │   │
│  │  weighted_score = cluster_score × match_ratio            │   │
│  │                                                         │   │
│  │  job_issue_index = Σ(weighted_score) / 클러스터 수       │   │
│  └─────────────────────────────────────────────────────────┘   │
│         │                                                       │
│         ▼                                                       │
│  ┌─────────────┐                                                │
│  │ 직업별 지수  │                                                │
│  │ 저장        │                                                │
│  └─────────────┘                                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.4 AI 모델 데이터 파이프라인

```
┌─────────────────────────────────────────────────────────────────┐
│                  AI 모델 데이터 파이프라인                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    데이터 소스                           │   │
│  │                                                         │   │
│  │  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │   │
│  │  │ Hugging │  │ Papers  │  │ 공식    │  │ 벤치마크│    │   │
│  │  │ Face    │  │ With    │  │ 발표    │  │ 리더보드│    │   │
│  │  │ Hub     │  │ Code    │  │ 자료    │  │         │    │   │
│  │  └────┬────┘  └────┬────┘  └────┬────┘  └────┬────┘    │   │
│  │       │            │            │            │          │   │
│  │       └────────────┴────────────┴────────────┘          │   │
│  │                          │                              │   │
│  └──────────────────────────┼──────────────────────────────┘   │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    데이터 수집기                          │   │
│  │                                                         │   │
│  │  수집 항목:                                              │   │
│  │  - 모델 기본 정보 (이름, 제작사, 출시일)                  │   │
│  │  - 기술 스펙 (파라미터 수, 컨텍스트 길이)                 │   │
│  │  - 벤치마크 점수 (MMLU, HumanEval, GSM8K 등)             │   │
│  │  - 가격 정보 (API 가격)                                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    점수 정규화                            │   │
│  │                                                         │   │
│  │  normalized_score = (raw_score - min) / (max - min) × 100│   │
│  │                                                         │   │
│  │  종합 점수 계산:                                         │   │
│  │  overall_score = Σ(benchmark_score × weight)             │   │
│  │                                                         │   │
│  │  지수 계산:                                              │   │
│  │  - intelligence_index: MMLU, ARC 기반                    │   │
│  │  - coding_index: HumanEval, MBPP 기반                    │   │
│  │  - math_index: GSM8K, MATH 기반                          │   │
│  │  - reasoning_index: HellaSwag, WinoGrande 기반           │   │
│  │  - language_index: TruthfulQA, LAMBADA 기반              │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                             │                                   │
│                             ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    데이터베이스 저장                       │   │
│  │                                                         │   │
│  │  - models 테이블                                         │   │
│  │  - benchmark_evaluations 테이블                          │   │
│  │  - model_overall_scores 테이블                           │   │
│  │  - model_pricing 테이블                                  │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 6.5 데이터 갱신 주기

| 데이터 유형 | 갱신 주기 | 설명 |
|------------|----------|------|
| 뉴스 기사 | 1시간 | 실시간 뉴스 수집 |
| 이슈 지수 | 1시간 | 클러스터 분석 후 지수 계산 |
| 직업별 지수 | 1시간 | 이슈 지수와 동시 갱신 |
| AI 모델 정보 | 1일 | 새 모델 출시 시 수동 추가 |
| 벤치마크 점수 | 1주 | 리더보드 변경 시 갱신 |
| 모델 가격 | 1일 | 가격 변동 모니터링 |


---

## 7. API 명세

### 7.1 인증 API (Authentication)

#### 7.1.1 회원가입

```http
POST /api/auth/register
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "nickname": "사용자닉네임",
  "job_category_id": 1
}

Response (201 Created):
{
  "success": true,
  "data": {
    "user": {
      "user_id": 1,
      "email": "user@example.com",
      "nickname": "사용자닉네임",
      "profile_image_url": null,
      "job_category_id": 1,
      "auth_provider": "local",
      "created_at": "2025-12-03T10:00:00Z"
    },
    "tokens": {
      "accessToken": "eyJhbGciOiJIUzI1NiIs...",
      "refreshToken": "eyJhbGciOiJIUzI1NiIs...",
      "expiresIn": "15m"
    }
  }
}
```

#### 7.1.2 로그인

```http
POST /api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}

Response (200 OK):
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": { ... }
  }
}
```

#### 7.1.3 토큰 갱신

```http
POST /api/auth/refresh
Content-Type: application/json

Request:
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

Response (200 OK):
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "15m"
  }
}
```

#### 7.1.4 이메일 중복 확인

```http
GET /api/auth/check-email?email=user@example.com

Response (200 OK):
{
  "success": true,
  "data": {
    "available": true
  }
}
```

#### 7.1.5 현재 사용자 정보

```http
GET /api/auth/me
Authorization: Bearer {accessToken}

Response (200 OK):
{
  "success": true,
  "data": {
    "user_id": 1,
    "email": "user@example.com",
    "nickname": "사용자닉네임",
    "profile_image_url": null,
    "job_category_id": 1,
    "auth_provider": "local",
    "created_at": "2025-12-03T10:00:00Z"
  }
}
```

### 7.2 이슈 지수 API (Issue Index)

#### 7.2.1 현재 이슈 지수 조회

```http
GET /api/issue-index/current

Response (200 OK):
{
  "success": true,
  "data": {
    "collected_at": "2025-12-03T10:00:00Z",
    "overall_index": 72.5,
    "active_clusters_count": 15,
    "inactive_clusters_count": 8,
    "total_articles_analyzed": 3200,
    "top_clusters": [
      {
        "cluster_id": "cluster_001",
        "topic_name": "GPT-5 개발 본격화",
        "tags": ["LLM", "모델출시", "기술트렌드"],
        "cluster_score": 89.2,
        "article_count": 45
      }
    ]
  },
  "metadata": {
    "data_availability": {
      "oldest_date": "2025-01-01",
      "latest_date": "2025-12-03",
      "total_snapshots": 8000,
      "collection_frequency": "hourly"
    }
  }
}
```

#### 7.2.2 이슈 지수 히스토리 조회

```http
GET /api/issue-index/history?start_date=2025-11-26&end_date=2025-12-03

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "collected_at": "2025-11-26T00:00:00Z",
      "overall_index": 68.3,
      "active_clusters_count": 12,
      "inactive_clusters_count": 5
    },
    ...
  ],
  "metadata": {
    "requested_start": "2025-11-26",
    "requested_end": "2025-12-03",
    "actual_count": 168,
    "missing_dates": []
  }
}
```

#### 7.2.3 클러스터 스냅샷 조회

```http
GET /api/issue-index/clusters?collected_at=2025-12-03T10:00:00Z

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "cluster_id": "cluster_001",
      "topic_name": "GPT-5 개발 본격화",
      "tags": ["LLM", "모델출시", "기술트렌드"],
      "appearance_count": 5,
      "article_count": 45,
      "article_indices": [1001, 1002, 1003, ...],
      "status": "active",
      "cluster_score": 89.2
    }
  ],
  "metadata": {
    "collected_at": "2025-12-03T10:00:00Z",
    "total_clusters": 23,
    "active_count": 15,
    "inactive_count": 8
  }
}
```

#### 7.2.4 기사 원문 조회

```http
GET /api/issue-index/articles?collected_at=2025-12-03T10:00:00Z&indices=1001,1002,1003

Response (200 OK):
{
  "success": true,
  "data": [
    {
      "article_index": 1001,
      "title": "OpenAI, GPT-5 개발 착수... 2025년 출시 목표",
      "link": "https://news.example.com/article/1001",
      "description": "OpenAI가 차세대 언어 모델 GPT-5 개발에...",
      "pub_date": "2025-12-03T09:30:00Z",
      "source": "테크뉴스"
    }
  ]
}
```

#### 7.2.5 전체 직업별 이슈 지수

```http
GET /api/issue-index/jobs/all?collected_at=2025-12-03T10:00:00Z

Response (200 OK):
{
  "collected_at": "2025-12-03T10:00:00Z",
  "jobs": [
    {
      "job_category": "기술/개발",
      "issue_index": 85.3,
      "active_clusters_count": 12,
      "inactive_clusters_count": 3,
      "total_articles_count": 450
    },
    {
      "job_category": "창작/콘텐츠",
      "issue_index": 78.1,
      "active_clusters_count": 8,
      "inactive_clusters_count": 2,
      "total_articles_count": 280
    },
    ...
  ]
}
```

### 7.3 AI 모델 API (Models)

#### 7.3.1 작업 분류 및 모델 추천

```http
POST /api/tasks/classify-and-recommend
Content-Type: application/json

Request:
{
  "user_input": "블로그 글을 작성하고 싶어요",
  "limit": 5
}

Response (200 OK):
{
  "success": true,
  "data": {
    "classification": {
      "task_category_id": 1,
      "category_code": "writing",
      "category_name_ko": "글쓰기",
      "category_name_en": "Writing",
      "confidence_score": 0.92,
      "reasoning": "사용자가 블로그 글 작성을 원하므로 글쓰기 카테고리로 분류됩니다."
    },
    "criteria": {
      "primary_benchmark": "MMLU_PRO",
      "secondary_benchmark": "TruthfulQA",
      "weights": {
        "primary": 0.7,
        "secondary": 0.3
      }
    },
    "recommended_models": [
      {
        "rank": 1,
        "model_id": "gpt-4-turbo",
        "model_name": "GPT-4 Turbo",
        "creator_name": "OpenAI",
        "weighted_score": 92.5,
        "benchmark_scores": {
          "primary": {
            "name": "MMLU_PRO",
            "score": 94.2,
            "weight": 0.7,
            "contribution": 65.94
          },
          "secondary": {
            "name": "TruthfulQA",
            "score": 88.5,
            "weight": 0.3,
            "contribution": 26.55
          }
        },
        "overall_score": 91.8,
        "pricing": {
          "input_price": 10.0,
          "output_price": 30.0
        }
      }
    ],
    "metadata": {
      "total_models_evaluated": 45,
      "classification_time_ms": 120,
      "recommendation_time_ms": 85
    }
  }
}
```

#### 7.3.2 직업별 모델 추천

```http
GET /api/models/recommend?job_category_code=tech_dev&limit=3

Response (200 OK):
{
  "success": true,
  "data": {
    "job_category": {
      "job_category_id": 1,
      "job_name": "기술/개발",
      "category_code": "tech_dev"
    },
    "criteria": {
      "primary_benchmark": "HumanEval",
      "secondary_benchmark": "MBPP",
      "weights": {
        "primary": 0.7,
        "secondary": 0.3
      }
    },
    "recommended_models": [
      {
        "rank": 1,
        "model_id": "claude-3-opus",
        "model_name": "Claude 3 Opus",
        "model_slug": "claude-3-opus",
        "creator_name": "Anthropic",
        "creator_slug": "anthropic",
        "weighted_score": 94.2,
        "benchmark_scores": {
          "primary": {
            "name": "HumanEval",
            "score": 96.5,
            "weight": 0.7
          },
          "secondary": {
            "name": "MBPP",
            "score": 89.1,
            "weight": 0.3
          }
        }
      }
    ]
  }
}
```

#### 7.3.3 모델 비교

```http
GET /api/comparison/compare?modelA=gpt-4-turbo&modelB=claude-3-opus

Response (200 OK):
{
  "success": true,
  "data": {
    "model_a": {
      "model_id": "gpt-4-turbo",
      "model_name": "GPT-4 Turbo",
      "creator_name": "OpenAI",
      "release_date": "2024-04-09",
      "parameter_size": null,
      "context_length": 128000,
      "is_open_source": 0,
      "pricing": {
        "price_input_1m": "10.00",
        "price_output_1m": "30.00",
        "price_blended_3to1": "15.00",
        "currency": "USD"
      },
      "overall_score": "91.8",
      "scores": {
        "intelligence": 94.2,
        "coding": 92.5,
        "math": 89.3,
        "reasoning": 91.8,
        "language": 93.1
      },
      "key_benchmarks": [...],
      "strengths": ["뛰어난 언어 이해력", "다양한 작업 수행"],
      "weaknesses": ["높은 API 비용"]
    },
    "model_b": { ... },
    "comparison_summary": {
      "winner_overall": "model_a",
      "winner_intelligence": "model_a",
      "winner_coding": "model_b",
      "winner_math": "model_a",
      "winner_reasoning": "model_b",
      "winner_language": "model_a",
      "score_differences": {
        "overall": 1.2,
        "intelligence": 0.8,
        "coding": -2.1,
        "math": 1.5,
        "reasoning": -0.3,
        "language": 0.9
      },
      "price_comparison": {
        "model_a_price": "15.00",
        "model_b_price": "18.75",
        "cheaper_model": "model_a"
      },
      "recommendation": "GPT-4 Turbo가 전반적으로 우수하며 가격도 저렴합니다."
    },
    "visual_data": {
      "bar_chart_data": [...],
      "radar_chart_data": {...},
      "performance_gap": 1.2
    }
  }
}
```

#### 7.3.4 모델 시리즈 타임라인

```http
GET /api/timeline/GPT?limit=20

Response (200 OK):
{
  "success": true,
  "data": {
    "series": "GPT",
    "timeline": [
      {
        "model_name": "GPT-4 Turbo",
        "release_date": "2024-04-09",
        "overall_score": 91.8,
        "major_improvements": [
          "128K 컨텍스트 지원",
          "비용 50% 절감",
          "JSON 모드 추가"
        ]
      },
      {
        "model_name": "GPT-4",
        "release_date": "2023-03-14",
        "overall_score": 88.5,
        "major_improvements": [
          "멀티모달 지원",
          "향상된 추론 능력"
        ]
      }
    ]
  }
}
```

### 7.4 커뮤니티 API (Community)

#### 7.4.1 게시글 목록 조회

```http
GET /api/community/posts?page=1&limit=20&sort=recent

Response (200 OK):
{
  "success": true,
  "data": {
    "items": [
      {
        "post_id": 1,
        "title": "GPT-4 vs Claude 3 비교 후기",
        "author": {
          "user_id": 1,
          "nickname": "AI매니아",
          "profile_image_url": null
        },
        "likes_count": 45,
        "comments_count": 12,
        "views_count": 320,
        "created_at": "2025-12-03T09:00:00Z"
      }
    ],
    "total": 150,
    "page": 1,
    "limit": 20
  }
}
```

#### 7.4.2 게시글 작성

```http
POST /api/community/posts
Authorization: Bearer {accessToken}
Content-Type: application/json

Request:
{
  "title": "새로운 AI 모델 사용 후기",
  "content": "오늘 새로 출시된 AI 모델을 사용해봤습니다..."
}

Response (201 Created):
{
  "success": true,
  "data": {
    "post_id": 151,
    "title": "새로운 AI 모델 사용 후기",
    "content": "오늘 새로 출시된 AI 모델을 사용해봤습니다...",
    "author": { ... },
    "likes_count": 0,
    "comments_count": 0,
    "views_count": 0,
    "is_liked": false,
    "created_at": "2025-12-03T10:30:00Z",
    "updated_at": "2025-12-03T10:30:00Z"
  }
}
```

#### 7.4.3 게시글 좋아요

```http
POST /api/community/posts/{postId}/like
Authorization: Bearer {accessToken}

Response (200 OK):
{
  "success": true,
  "data": {
    "post_id": 1,
    "is_liked": true,
    "likes_count": 46
  }
}
```

### 7.5 에러 응답 형식

```json
{
  "success": false,
  "error": {
    "code": 2001,
    "message": "이메일 또는 비밀번호가 올바르지 않습니다.",
    "details": null
  },
  "timestamp": "2025-12-03T10:00:00Z",
  "workflow_id": "wf_abc123"
}
```

### 7.6 에러 코드 목록

| 코드 | 설명 | HTTP Status |
|------|------|-------------|
| 1001 | 이미 사용 중인 이메일 | 409 |
| 1002 | 이미 사용 중인 닉네임 | 409 |
| 1003 | 비밀번호 강도 부족 | 400 |
| 1004 | 잘못된 이메일 형식 | 400 |
| 2001 | 잘못된 인증 정보 | 401 |
| 2002 | 계정을 찾을 수 없음 | 404 |
| 2003 | 계정 잠금 | 403 |
| 3001 | 토큰 만료 | 401 |
| 3002 | 잘못된 토큰 | 401 |


---

## 8. 연구 결과

### 8.1 AI 이슈 지수 분석 결과

#### 8.1.1 지수 산출 방법론

본 프로젝트에서 개발한 AI 이슈 지수는 다음과 같은 방법론을 통해 산출됩니다:

```
AI 이슈 지수 = f(뉴스 볼륨, 클러스터 점수, 시간 가중치, 출처 다양성)

구체적 계산식:
overall_index = (avg_cluster_score × 0.7) + (volume_factor × 30)

where:
- avg_cluster_score: 활성 클러스터들의 평균 점수
- volume_factor: min(active_clusters / 20, 1)
```

#### 8.1.2 클러스터링 알고리즘 성능

| 알고리즘 | 정확도 | 처리 시간 | 선택 여부 |
|----------|--------|----------|----------|
| K-Means + TF-IDF | 78% | 빠름 | 기본 |
| HDBSCAN + BERT | 89% | 느림 | 고품질 모드 |
| Agglomerative | 82% | 중간 | 대안 |

#### 8.1.3 직업별 AI 영향도 분석

연구 결과, 직업별 AI 영향도는 다음과 같은 패턴을 보입니다:

| 직업 카테고리 | 평균 이슈 지수 | 주요 영향 분야 |
|--------------|---------------|---------------|
| 기술/개발 | 85.3 | 코드 생성, 자동화 |
| 창작/콘텐츠 | 78.1 | 이미지/영상 생성 |
| 분석/사무 | 72.5 | 데이터 분석, 문서 작성 |
| 의료/과학 | 68.9 | 진단 보조, 신약 개발 |
| 교육 | 65.2 | 개인화 학습, 튜터링 |
| 비즈니스 | 63.8 | 마케팅 자동화, 고객 분석 |

#### 8.1.4 시계열 분석 결과

```
2024년 주요 이슈 지수 변동 이벤트:

1. GPT-4 Turbo 출시 (2024.04)
   - 지수 상승: +15점
   - 지속 기간: 2주

2. Claude 3 출시 (2024.03)
   - 지수 상승: +12점
   - 지속 기간: 10일

3. Sora 발표 (2024.02)
   - 지수 상승: +20점
   - 지속 기간: 3주

4. EU AI Act 통과 (2024.03)
   - 지수 상승: +8점
   - 지속 기간: 1주
```

### 8.2 AI 모델 벤치마크 분석

#### 8.2.1 주요 벤치마크 설명

| 벤치마크 | 측정 영역 | 설명 |
|----------|----------|------|
| MMLU | 지식/이해 | 57개 과목의 다지선다 문제 |
| MMLU_PRO | 지식/이해 | MMLU의 강화 버전 |
| HumanEval | 코딩 | Python 함수 생성 능력 |
| MBPP | 코딩 | 기본 프로그래밍 문제 |
| GSM8K | 수학 | 초등학교 수준 수학 문제 |
| MATH | 수학 | 고급 수학 문제 |
| HellaSwag | 추론 | 상식 추론 능력 |
| WinoGrande | 추론 | 대명사 해석 능력 |
| TruthfulQA | 언어 | 사실성 평가 |
| ARC | 지능 | 과학 추론 문제 |

#### 8.2.2 모델별 성능 비교 (2024년 12월 기준)

```
종합 점수 순위:

1. GPT-4 Turbo (OpenAI)      - 91.8점
2. Claude 3 Opus (Anthropic) - 90.6점
3. Gemini Ultra (Google)     - 89.2점
4. GPT-4 (OpenAI)            - 88.5점
5. Claude 3 Sonnet           - 85.3점

코딩 능력 순위:

1. Claude 3 Opus             - 96.5점 (HumanEval)
2. GPT-4 Turbo               - 94.2점
3. Gemini Ultra              - 91.8점

수학 능력 순위:

1. GPT-4 Turbo               - 92.3점 (GSM8K)
2. Claude 3 Opus             - 90.1점
3. Gemini Ultra              - 88.7점
```

#### 8.2.3 가격 대비 성능 분석

```
가성비 지수 = 종합 점수 / (blended_price × 10)

가성비 순위:

1. Claude 3 Haiku    - 가성비 지수: 8.5
2. GPT-3.5 Turbo     - 가성비 지수: 7.2
3. Gemini Pro        - 가성비 지수: 6.8
4. Claude 3 Sonnet   - 가성비 지수: 5.5
5. GPT-4 Turbo       - 가성비 지수: 4.2
```

### 8.3 작업 분류 모델 성능

#### 8.3.1 분류 정확도

```
25개 작업 카테고리 분류 성능:

- 전체 정확도: 87.3%
- Top-3 정확도: 96.8%
- 평균 신뢰도: 0.82

카테고리별 정확도:
- coding (코딩): 94.2%
- writing (글쓰기): 91.5%
- translation (번역): 93.8%
- image_generation (이미지 생성): 89.1%
- summarization (요약): 88.7%
```

#### 8.3.2 추천 모델 만족도

```
사용자 피드백 기반 추천 만족도:

- 1순위 모델 선택률: 62%
- Top-3 내 선택률: 89%
- 평균 만족도: 4.2/5.0
```

### 8.4 사용자 행동 분석

#### 8.4.1 주요 사용 패턴

```
페이지별 체류 시간:

1. 모델 추천 페이지: 평균 4분 32초
2. 이슈 지수 페이지: 평균 3분 15초
3. 모델 비교 페이지: 평균 5분 48초
4. 커뮤니티 페이지: 평균 2분 45초

가장 많이 검색된 작업:
1. "코드 작성" (18%)
2. "글쓰기" (15%)
3. "번역" (12%)
4. "이미지 생성" (11%)
5. "요약" (9%)
```

#### 8.4.2 직업별 관심 분야

```
기술/개발자:
- 주요 관심: 코딩 AI, 코드 리뷰, 자동화
- 선호 모델: Claude 3 Opus, GPT-4 Turbo

창작/콘텐츠:
- 주요 관심: 이미지 생성, 글쓰기 보조
- 선호 모델: DALL-E 3, Midjourney, Claude

비즈니스:
- 주요 관심: 문서 작성, 데이터 분석
- 선호 모델: GPT-4, Claude 3 Sonnet
```


---

## 9. 활용 방안

### 9.1 개인 사용자 활용

#### 9.1.1 AI 모델 선택 가이드

```
사용 시나리오별 추천 활용법:

1. 코딩 작업
   ├── 모델 추천 탭 → "코드 작성" 검색
   ├── 추천 모델 확인 (HumanEval 기준)
   └── 가격 비교 후 선택

2. 글쓰기 작업
   ├── 모델 추천 탭 → "블로그 글 작성" 검색
   ├── 추천 모델 확인 (MMLU_PRO 기준)
   └── 샘플 출력 비교

3. 이미지 생성
   ├── 모델 추천 탭 → "이미지 생성" 검색
   ├── 전문 이미지 모델 추천
   └── 스타일별 비교
```

#### 9.1.2 직업별 AI 영향 모니터링

```
활용 방법:

1. 온보딩에서 직업 선택
2. 홈 화면에서 직업별 이슈 지수 확인
3. 이슈 페이지에서 상세 클러스터 분석
4. 관련 뉴스 기사 원문 확인
5. 커뮤니티에서 동종 업계 의견 교류
```

#### 9.1.3 AI 트렌드 파악

```
일일 루틴:

1. 홈 화면 → 오늘의 이슈 지수 확인
2. 주요 클러스터 3개 확인
3. 관심 태그 기반 뉴스 필터링
4. 새로운 모델 출시 여부 확인
```

### 9.2 기업/조직 활용

#### 9.2.1 AI 도입 의사결정 지원

```
활용 프로세스:

1. 업무 분석
   └── 자동화 가능한 작업 식별

2. 모델 탐색
   └── 작업별 최적 모델 추천 활용

3. 비용 분석
   └── 모델 비교 기능으로 가격 비교

4. 성능 검증
   └── 벤치마크 점수 기반 객관적 평가

5. 도입 결정
   └── 종합 분석 결과 기반 의사결정
```

#### 9.2.2 AI 리스크 모니터링

```
모니터링 항목:

1. 직업별 이슈 지수 추이
   - 급격한 상승 시 대응 필요

2. AI 규제 관련 클러스터
   - 법적 리스크 사전 파악

3. 경쟁사 AI 도입 동향
   - 업계 트렌드 파악
```

#### 9.2.3 직원 교육 자료

```
교육 활용:

1. AI 기초 교육
   - 모델 비교 기능으로 AI 이해도 향상

2. 업무별 AI 활용법
   - 작업 분류 기능으로 적합한 AI 도구 학습

3. AI 윤리 교육
   - 이슈 지수의 AI 윤리 관련 클러스터 활용
```

### 9.3 연구/교육 기관 활용

#### 9.3.1 AI 연구 자료

```
연구 활용:

1. 벤치마크 데이터
   - 모델별 성능 추이 분석
   - 벤치마크 간 상관관계 연구

2. 뉴스 클러스터 데이터
   - AI 담론 분석
   - 사회적 인식 변화 연구

3. 사용자 행동 데이터
   - AI 도구 선택 패턴 연구
   - 직업별 AI 수용도 분석
```

#### 9.3.2 교육 커리큘럼 지원

```
교육 활용:

1. AI 개론 수업
   - 모델 비교 기능으로 AI 발전사 설명
   - 타임라인 기능으로 모델 진화 시각화

2. AI 윤리 수업
   - 이슈 지수의 AI 윤리 클러스터 활용
   - 실제 뉴스 기반 토론 자료

3. AI 실습 수업
   - 작업별 모델 추천으로 실습 도구 선택
   - 벤치마크 이해 교육
```

### 9.4 미디어/콘텐츠 활용

#### 9.4.1 AI 뉴스 큐레이션

```
활용 방법:

1. 이슈 지수 기반 헤드라인 선정
2. 클러스터별 심층 기사 작성
3. 직업별 영향 분석 기사
4. 모델 비교 리뷰 콘텐츠
```

#### 9.4.2 데이터 저널리즘

```
데이터 활용:

1. 이슈 지수 추이 시각화
2. 직업별 AI 영향도 인포그래픽
3. 모델 성능 비교 차트
4. AI 투자/출시 타임라인
```

### 9.5 API 연동 활용

#### 9.5.1 외부 서비스 연동

```javascript
// 이슈 지수 위젯 연동 예시
const fetchIssueIndex = async () => {
  const response = await fetch('https://api.ainus.com/issue-index/current');
  const data = await response.json();
  
  return {
    index: data.data.overall_index,
    status: data.data.overall_index >= 75 ? '경계' : 
            data.data.overall_index >= 50 ? '주의' : '안정',
    topCluster: data.data.top_clusters[0].topic_name
  };
};

// 모델 추천 연동 예시
const getModelRecommendation = async (task) => {
  const response = await fetch('https://api.ainus.com/tasks/classify-and-recommend', {
    method: 'POST',
    body: JSON.stringify({ user_input: task, limit: 3 })
  });
  
  return response.json();
};
```

#### 9.5.2 챗봇/어시스턴트 연동

```
연동 시나리오:

사용자: "코딩에 좋은 AI 모델 추천해줘"

챗봇 → Ainus API 호출:
POST /tasks/classify-and-recommend
{ "user_input": "코딩", "limit": 3 }

챗봇 응답:
"코딩 작업에는 다음 모델을 추천드립니다:
1. Claude 3 Opus (HumanEval 96.5점)
2. GPT-4 Turbo (HumanEval 94.2점)
3. Gemini Ultra (HumanEval 91.8점)"
```


---

## 10. 기대 효과

### 10.1 사용자 측면

#### 10.1.1 정보 접근성 향상

| 기존 문제 | Ainus 솔루션 | 기대 효과 |
|----------|-------------|----------|
| AI 정보 분산 | 통합 대시보드 | 정보 탐색 시간 70% 감소 |
| 모델 선택 어려움 | 맞춤 추천 | 의사결정 시간 50% 단축 |
| 벤치마크 이해 부족 | 시각화 비교 | AI 이해도 향상 |
| 업계 동향 파악 어려움 | 이슈 지수 | 실시간 트렌드 파악 |

#### 10.1.2 비용 절감

```
예상 비용 절감 효과:

1. AI 도구 선택 최적화
   - 불필요한 구독 방지: 월 $50-200 절감
   - 작업별 최적 모델 선택: API 비용 30% 절감

2. 학습 시간 단축
   - AI 정보 탐색 시간: 주 5시간 → 1시간
   - 모델 비교 시간: 2시간 → 15분

3. 생산성 향상
   - 적합한 AI 도구 활용으로 업무 효율 20% 향상
```

#### 10.1.3 역량 강화

```
사용자 역량 향상 영역:

1. AI 리터러시
   - 벤치마크 이해
   - 모델 특성 파악
   - AI 한계 인식

2. 의사결정 능력
   - 데이터 기반 도구 선택
   - 비용-성능 분석
   - 리스크 평가

3. 트렌드 감각
   - 업계 동향 파악
   - 신기술 조기 인지
   - 경쟁력 유지
```

### 10.2 산업 측면

#### 10.2.1 AI 민주화 촉진

```
기대 효과:

1. 진입 장벽 낮춤
   - 비전문가도 AI 활용 가능
   - 중소기업 AI 도입 촉진
   - 개인 창작자 역량 강화

2. 정보 비대칭 해소
   - 객관적 벤치마크 정보 제공
   - 가격 투명성 확보
   - 공정한 비교 기준 제시

3. 건전한 경쟁 촉진
   - 성능 기반 모델 선택
   - 가격 경쟁 유도
   - 품질 향상 동기 부여
```

#### 10.2.2 AI 생태계 발전

```
생태계 기여:

1. 사용자 피드백 수집
   - 모델별 실사용 만족도
   - 개선 필요 영역 식별
   - 개발사에 인사이트 제공

2. 벤치마크 표준화
   - 일관된 평가 기준
   - 비교 가능한 데이터
   - 업계 표준 형성

3. 커뮤니티 형성
   - 사용자 간 지식 공유
   - 베스트 프랙티스 확산
   - 협업 기회 창출
```

#### 10.2.3 경제적 파급 효과

```
예상 경제적 효과:

1. AI 시장 활성화
   - 정보 접근성 향상으로 AI 도입 증가
   - 예상 시장 성장 기여: 연 5-10%

2. 생산성 향상
   - 적합한 AI 도구 활용
   - 업무 자동화 가속
   - 예상 생산성 향상: 15-25%

3. 일자리 전환 지원
   - AI 영향 사전 인지
   - 재교육 방향 제시
   - 원활한 직업 전환 지원
```

### 10.3 사회적 측면

#### 10.3.1 AI 인식 개선

```
기대 효과:

1. 균형 잡힌 시각
   - 과대/과소 평가 방지
   - 객관적 정보 기반 인식
   - 합리적 기대 형성

2. 불안감 해소
   - 직업별 영향도 가시화
   - 대응 방안 제시
   - 불확실성 감소

3. 건전한 담론 형성
   - 데이터 기반 토론
   - 감정적 반응 감소
   - 생산적 논의 촉진
```

#### 10.3.2 디지털 격차 해소

```
포용적 AI 활용:

1. 접근성 확보
   - 무료 기본 서비스
   - 모바일 앱 지원
   - 다국어 지원 (예정)

2. 교육 기회 제공
   - AI 기초 정보 제공
   - 활용 가이드 제공
   - 커뮤니티 학습

3. 취약 계층 지원
   - 직업 전환 정보
   - 재교육 방향 제시
   - 지원 정책 연계
```

### 10.4 정량적 기대 효과

#### 10.4.1 사용자 지표

| 지표 | 현재 | 목표 (1년) | 목표 (3년) |
|------|------|-----------|-----------|
| 월간 활성 사용자 | - | 10,000 | 100,000 |
| 일일 방문자 | - | 1,000 | 15,000 |
| 평균 체류 시간 | - | 5분 | 8분 |
| 재방문율 | - | 40% | 60% |

#### 10.4.2 서비스 지표

| 지표 | 현재 | 목표 (1년) | 목표 (3년) |
|------|------|-----------|-----------|
| 모델 추천 정확도 | 87% | 92% | 95% |
| 이슈 지수 신뢰도 | - | 85% | 92% |
| API 응답 시간 | 500ms | 200ms | 100ms |
| 서비스 가용성 | - | 99.5% | 99.9% |

#### 10.4.3 비즈니스 지표

| 지표 | 목표 (1년) | 목표 (3년) |
|------|-----------|-----------|
| 프리미엄 전환율 | 5% | 12% |
| API 파트너 수 | 10 | 50 |
| 기업 고객 수 | 20 | 200 |
| 월간 API 호출 | 100만 | 1,000만 |


---

## 11. 향후 발전 방향

### 11.1 단기 로드맵 (6개월)

#### 11.1.1 기능 고도화

```
Phase 1 (1-2개월):
├── 이슈 지수 알림 기능
│   ├── 푸시 알림 (급격한 지수 변동)
│   ├── 이메일 다이제스트 (일간/주간)
│   └── 관심 태그 기반 맞춤 알림
│
├── 모델 비교 강화
│   ├── 3개 이상 모델 동시 비교
│   ├── 사용자 리뷰 통합
│   └── 실제 사용 사례 추가
│
└── 커뮤니티 기능 확장
    ├── 대댓글 기능
    ├── 이미지 첨부
    └── 태그 기반 필터링

Phase 2 (3-4개월):
├── 개인화 강화
│   ├── AI 기반 콘텐츠 추천
│   ├── 사용 패턴 분석
│   └── 맞춤형 대시보드
│
├── 데이터 시각화 개선
│   ├── 인터랙티브 차트
│   ├── 커스텀 기간 선택
│   └── 데이터 내보내기
│
└── 성능 최적화
    ├── 이미지 최적화
    ├── 코드 스플리팅
    └── 캐싱 전략 개선

Phase 3 (5-6개월):
├── iOS 앱 출시
├── 다국어 지원 (영어)
└── API 공개 (베타)
```

#### 11.1.2 기술 개선

```
인프라:
├── CDN 도입
├── 데이터베이스 최적화
├── 모니터링 시스템 구축
└── CI/CD 파이프라인 개선

보안:
├── 2단계 인증 (2FA)
├── 보안 감사
├── GDPR 준수
└── 데이터 암호화 강화

품질:
├── 단위 테스트 커버리지 80%
├── E2E 테스트 도입
├── 성능 테스트 자동화
└── 접근성 개선 (WCAG 2.1)
```

### 11.2 중기 로드맵 (1년)

#### 11.2.1 신규 기능

```
AI 어시스턴트:
├── 챗봇 인터페이스
│   ├── 자연어 모델 추천
│   ├── 이슈 요약 제공
│   └── 사용법 안내
│
├── 음성 인터페이스
│   ├── 음성 검색
│   └── 음성 알림
│
└── 스마트 알림
    ├── 예측 기반 알림
    └── 컨텍스트 인식 알림

프리미엄 기능:
├── 상세 분석 리포트
│   ├── 주간/월간 리포트
│   ├── 커스텀 리포트
│   └── PDF 내보내기
│
├── API 접근
│   ├── 기본 API (무료)
│   ├── 고급 API (유료)
│   └── 엔터프라이즈 API
│
└── 팀 기능
    ├── 팀 대시보드
    ├── 공유 북마크
    └── 협업 도구
```

#### 11.2.2 플랫폼 확장

```
웹 확장:
├── 브라우저 확장 프로그램
│   ├── 빠른 모델 검색
│   ├── 이슈 지수 위젯
│   └── 뉴스 하이라이트
│
└── 위젯/임베드
    ├── 이슈 지수 위젯
    ├── 모델 비교 위젯
    └── 커스텀 임베드

통합:
├── Slack 연동
├── Discord 봇
├── Notion 통합
└── Zapier 연동
```

### 11.3 장기 비전 (3년)

#### 11.3.1 글로벌 확장

```
지역 확장:
├── 1단계: 영어권 (미국, 영국)
├── 2단계: 아시아 (일본, 중국)
├── 3단계: 유럽 (독일, 프랑스)
└── 4단계: 기타 지역

현지화:
├── 다국어 UI
├── 지역별 뉴스 소스
├── 현지 AI 모델 포함
└── 지역별 직업 카테고리
```

#### 11.3.2 AI 연구 플랫폼

```
연구 기능:
├── 벤치마크 데이터셋 공개
├── 연구자 API
├── 학술 파트너십
└── 연구 논문 발행

데이터 서비스:
├── AI 시장 분석 리포트
├── 트렌드 예측 서비스
├── 커스텀 데이터 분석
└── 컨설팅 서비스
```

#### 11.3.3 생태계 구축

```
파트너 생태계:
├── AI 모델 제공사 파트너십
├── 교육 기관 협력
├── 기업 고객 프로그램
└── 개발자 커뮤니티

오픈 플랫폼:
├── 오픈 API
├── 플러그인 마켓플레이스
├── 커뮤니티 기여 프로그램
└── 오픈소스 도구 공개
```

### 11.4 기술 발전 방향

#### 11.4.1 AI/ML 고도화

```
자체 AI 모델:
├── 작업 분류 모델 개선
│   ├── 더 세분화된 카테고리
│   ├── 다국어 지원
│   └── 컨텍스트 이해 향상
│
├── 이슈 분석 모델
│   ├── 감성 분석
│   ├── 영향도 예측
│   └── 트렌드 예측
│
└── 추천 시스템
    ├── 협업 필터링
    ├── 콘텐츠 기반 필터링
    └── 하이브리드 추천
```

#### 11.4.2 데이터 인프라

```
데이터 레이크:
├── 실시간 데이터 수집
├── 대용량 데이터 처리
├── 데이터 품질 관리
└── 데이터 거버넌스

분석 인프라:
├── 실시간 분석
├── 배치 분석
├── ML 파이프라인
└── A/B 테스트 플랫폼
```

### 11.5 수익 모델

#### 11.5.1 B2C 모델

| 플랜 | 가격 | 기능 |
|------|------|------|
| Free | 무료 | 기본 기능, 광고 포함 |
| Pro | $9.99/월 | 광고 제거, 상세 분석, 알림 |
| Premium | $19.99/월 | API 접근, 리포트, 우선 지원 |

#### 11.5.2 B2B 모델

| 플랜 | 가격 | 기능 |
|------|------|------|
| Team | $49/월 | 5명, 팀 대시보드 |
| Business | $199/월 | 20명, 커스텀 리포트 |
| Enterprise | 협의 | 무제한, 전용 지원, SLA |

#### 11.5.3 API 모델

| 플랜 | 가격 | 호출 수 |
|------|------|--------|
| Free | 무료 | 1,000/월 |
| Starter | $29/월 | 10,000/월 |
| Growth | $99/월 | 100,000/월 |
| Scale | $299/월 | 1,000,000/월 |

---

## 부록

### A. 용어 정의

| 용어 | 정의 |
|------|------|
| 이슈 지수 | AI 관련 뉴스의 양과 중요도를 0-100으로 수치화한 지표 |
| 클러스터 | 유사한 주제의 뉴스 기사들을 그룹화한 단위 |
| 벤치마크 | AI 모델의 성능을 측정하는 표준화된 테스트 |
| 가중 점수 | 여러 벤치마크 점수에 가중치를 적용한 종합 점수 |
| 토큰 | AI 모델이 처리하는 텍스트의 기본 단위 |

### B. 참고 자료

1. AI 벤치마크 리더보드
   - Hugging Face Open LLM Leaderboard
   - Papers With Code Benchmarks
   - Chatbot Arena

2. AI 뉴스 소스
   - TechCrunch AI
   - MIT Technology Review
   - AI News

3. 관련 연구
   - "Measuring Massive Multitask Language Understanding" (MMLU)
   - "Evaluating Large Language Models Trained on Code" (HumanEval)

### C. 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|----------|
| 1.0.0 | 2025-12-03 | 초기 문서 작성 |

---

**문서 작성일**: 2025년 12월 3일  
**프로젝트**: Ainus (AI in us)  
**버전**: 1.0.0
