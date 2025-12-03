# Design Document

## Overview

이 설계는 ModelPage 컴포넌트의 타임라인 탭에서 벤치마크 성능 추이 그래프의 두 가지 문제를 해결합니다:
1. 시리즈 선택 드롭다운을 동적 데이터로 변경
2. Y축 범위를 실제 데이터 기반으로 동적 계산

## Architecture

기존 ModelPage 컴포넌트 내에서 수정이 이루어지며, 새로운 유틸리티 함수를 추가하여 Y축 도메인을 계산합니다.

```
ModelPage.tsx
├── availableSeriesList (기존 상태 - API에서 로드됨)
├── benchmarkProgressionData (기존 상태)
├── calculateYAxisDomain() (신규 함수)
└── Series_Selector (수정 - 동적 데이터 사용)
```

## Components and Interfaces

### 1. Series Selector 수정

**현재 코드:**
```tsx
{['GPT', 'Claude'].map((series) => (
  <SelectItem key={series} value={series}>
    {series}
  </SelectItem>
))}
```

**수정 후:**
```tsx
{availableSeriesList.map((series) => (
  <SelectItem key={series.series_name} value={series.series_name}>
    {series.series_name}
  </SelectItem>
))}
```

### 2. Y축 도메인 계산 함수

```tsx
const calculateYAxisDomain = (data: any[]): [number, number] => {
  if (!data || data.length === 0) {
    return [0, 1]; // 기본값
  }
  
  const scores = data.map(d => d.score).filter(s => typeof s === 'number');
  if (scores.length === 0) {
    return [0, 1];
  }
  
  const min = Math.min(...scores);
  const max = Math.max(...scores);
  const range = max - min;
  const padding = range * 0.1; // 10% 패딩
  
  // 최소값이 0보다 작아지지 않도록 처리
  const domainMin = Math.max(0, min - padding);
  const domainMax = max + padding;
  
  return [domainMin, domainMax];
};
```

## Data Models

기존 데이터 모델을 그대로 사용합니다:

```typescript
// 기존 SeriesInfo 타입
interface SeriesInfo {
  series_name: string;
  model_count: number;
}

// 벤치마크 진행 데이터
interface BenchmarkProgressionItem {
  model_name: string;
  release_date: string;
  score: number; // 0~1 범위의 정규화된 점수
  improvement_from_previous?: number;
}
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Series selector displays all available series
*For any* available series list returned from the API, the Series_Selector dropdown SHALL contain exactly all series from that list.
**Validates: Requirements 1.1**

### Property 2: Y-axis domain contains all data points
*For any* non-empty benchmark data array, the calculated Y_Axis_Domain SHALL have a minimum value less than or equal to the smallest score and a maximum value greater than or equal to the largest score.
**Validates: Requirements 2.1**

### Property 3: Y-axis domain has correct padding
*For any* non-empty benchmark data array with min and max scores, the calculated Y_Axis_Domain SHALL have padding of approximately 10% of the data range on both ends.
**Validates: Requirements 2.2**

## Error Handling

1. **빈 시리즈 목록**: `availableSeriesList`가 비어있거나 로딩 중일 때 로딩 표시
2. **빈 벤치마크 데이터**: 데이터가 없을 때 기본 Y축 범위 [0, 1] 사용
3. **유효하지 않은 점수**: score가 숫자가 아닌 경우 필터링

## Testing Strategy

### Unit Tests
- `calculateYAxisDomain` 함수의 다양한 입력에 대한 테스트
- 빈 배열, 단일 요소, 여러 요소 케이스

### Property-Based Tests
- fast-check 라이브러리 사용
- Property 2, 3에 대한 속성 기반 테스트 구현
- 랜덤 점수 배열 생성하여 도메인 계산 검증
