# Requirements Document

## Introduction

모델 추천 & 비교 페이지의 타임라인 탭에서 "벤치마크별 성능 추이" 그래프에 두 가지 문제가 있습니다:
1. 시리즈 선택 드롭다운이 'GPT', 'Claude'로 하드코딩되어 있어 API에서 제공하는 다른 시리즈를 선택할 수 없음
2. Y축 범위가 [70, 90]으로 하드코딩되어 있어 실제 데이터(0~1 범위의 정규화된 점수)가 표시되지 않음

## Glossary

- **Timeline_Chart_System**: ModelPage 컴포넌트 내 타임라인 탭의 벤치마크 성능 추이 그래프 시스템
- **Series_Selector**: 벤치마크 성능 추이 그래프에서 시리즈를 선택하는 드롭다운 컴포넌트
- **Y_Axis_Domain**: 그래프의 Y축 표시 범위
- **Benchmark_Data**: API에서 로드된 벤치마크 점수 데이터 (0~1 범위의 정규화된 값)
- **Available_Series_List**: API에서 동적으로 로드된 사용 가능한 시리즈 목록

## Requirements

### Requirement 1

**User Story:** As a user, I want to select any available series from the benchmark chart dropdown, so that I can view performance trends for all AI model series.

#### Acceptance Criteria

1. WHEN the Timeline_Chart_System loads THEN the Series_Selector SHALL display all series from Available_Series_List
2. WHEN Available_Series_List is empty or loading THEN the Series_Selector SHALL display a loading indicator
3. WHEN a user selects a series from Series_Selector THEN the Timeline_Chart_System SHALL load and display benchmark data for that series

### Requirement 2

**User Story:** As a user, I want the Y-axis to automatically adjust based on actual data values, so that I can see the benchmark scores correctly visualized.

#### Acceptance Criteria

1. WHEN Benchmark_Data is loaded THEN the Timeline_Chart_System SHALL calculate Y_Axis_Domain based on minimum and maximum score values in the data
2. WHEN calculating Y_Axis_Domain THEN the Timeline_Chart_System SHALL add padding of 10% below minimum and 10% above maximum for visual clarity
3. WHEN Benchmark_Data contains scores in 0-1 range THEN the Timeline_Chart_System SHALL display Y_Axis_Domain appropriately scaled (e.g., 0.0 to 1.0)
4. WHEN Benchmark_Data is empty THEN the Timeline_Chart_System SHALL use a default Y_Axis_Domain of [0, 1]
