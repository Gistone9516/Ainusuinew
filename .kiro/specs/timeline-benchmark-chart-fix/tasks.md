# Implementation Plan

- [-] 1. Y축 도메인 계산 함수 구현



  - [x] 1.1 `calculateYAxisDomain` 함수를 ModelPage 컴포넌트 내에 추가



    - 빈 배열일 때 기본값 [0, 1] 반환
    - 데이터의 min/max 값 계산
    - 10% 패딩 적용
    - _Requirements: 2.1, 2.2, 2.4_
  - [ ]* 1.2 Write property test for Y-axis domain calculation
    - **Property 2: Y-axis domain contains all data points**
    - **Property 3: Y-axis domain has correct padding**
    - **Validates: Requirements 2.1, 2.2**

- [x] 2. 시리즈 선택 드롭다운 동적화






  - [x] 2.1 벤치마크 성능 추이 그래프의 시리즈 선택 드롭다운을 `availableSeriesList`로 변경

    - 하드코딩된 `['GPT', 'Claude']` 배열 제거
    - `availableSeriesList.map()` 사용
    - 로딩 상태 처리
    - _Requirements: 1.1, 1.2_
  - [ ]* 2.2 Write property test for series selector
    - **Property 1: Series selector displays all available series**
    - **Validates: Requirements 1.1**

- [x] 3. Y축 도메인을 동적 계산 값으로 적용





  - [x] 3.1 LineChart의 YAxis domain을 `calculateYAxisDomain(getBenchmarkData())`로 변경


    - 하드코딩된 `[70, 90]` 제거
    - 동적 계산 함수 호출
    - _Requirements: 2.1, 2.3_

- [ ] 4. Checkpoint - Make sure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
