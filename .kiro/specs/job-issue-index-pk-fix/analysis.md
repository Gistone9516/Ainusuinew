# 직업별 이슈 지수 PK(날짜) 오송신 문제 분석 및 해결 방안

## 1. 문제 요약

**현상**: 직업별 이슈 지수 페이지에서 데이터가 출력되지 않음
**원인**: 프론트엔드에서 백엔드로 전송하는 PK(날짜)가 백엔드 DB에 저장된 형식과 일치하지 않아, 백엔드가 해당 데이터를 찾지 못하고 빈 데이터(0)를 반환

---

## 2. 현재 프론트엔드 코드 분석

### 2.1 직업별 지수 API 호출 흐름

```
IssuePage.tsx → fetchAllJobIndices() → IssueAPI.getAllJobIndices() → /issue-index/jobs/all
```

### 2.2 현재 코드 동작 방식

**IssuePage.tsx (Line 143-150)**:
```typescript
// 직업별 지수 조회
const fetchAllJobIndices = async (collectedAt?: string) => {
  setIsLoadingJobs(true);
  try {
    // collected_at을 파라미터로 받아서 사용
    const response = await IssueAPI.getAllJobIndices(collectedAt);
    console.log('[IssuePage] Job indices fetched with collected_at:', collectedAt, 'Result:', response);
    setAllJobIndices(response.jobs || []);
  } catch (err: any) {
    console.error('Failed to fetch job indices:', err);
  } finally {
    setIsLoadingJobs(false);
  }
};
```

**IssuePage.tsx (Line 178-181)** - useEffect에서 호출:
```typescript
useEffect(() => {
  if (selectedTab === 'byjob' && allJobIndices.length === 0 && currentIndex?.collected_at) {
    fetchAllJobIndices(currentIndex.collected_at);
  }
}, [selectedTab, currentIndex?.collected_at]);
```

**issues.ts (Line 155-168)** - API 함수:
```typescript
export const getAllJobIndices = async (
  collectedAt?: string
): Promise<T.AllJobIndicesResponse> => {
  try {
    const { data } = await apiClient.get<T.AllJobIndicesResponse>(
      '/issue-index/jobs/all',
      { params: collectedAt ? { collected_at: collectedAt } : {} }
    );
    console.log('[IssueAPI] All job indices response:', JSON.stringify(data, null, 2));
    return data;
  } catch (error: any) {
    console.error('[IssueAPI] getAllJobIndices failed:', error?.message);
    return { collected_at: new Date().toISOString(), jobs: [] };
  }
};
```

### 2.3 문제 지점 분석

1. **`currentIndex.collected_at`의 형식**: 
   - 현재 이슈 지수 API(`/issue-index/current`)에서 받아온 `collected_at` 값을 그대로 사용
   - 이 값은 **ISO 8601 전체 형식** (예: `2025-01-15T14:30:00.000Z`)

2. **백엔드 DB의 PK 형식 (추정)**:
   - 백엔드 DB에서 직업별 지수의 PK가 **날짜만** (예: `2025-01-15`) 또는 **다른 형식**으로 저장되어 있을 가능성
   - 또는 시간대(timezone) 차이로 인해 날짜가 하루 차이 발생

3. **전송되는 파라미터 예시**:
   ```
   프론트엔드 전송: collected_at=2025-01-15T14:30:00.000Z
   백엔드 DB PK: 2025-01-15 (날짜만) 또는 2025-01-15T00:00:00.000Z
   ```

---

## 3. 해결 방안

### 방안 A: 프론트엔드에서 날짜 형식 변환 (권장)

프론트엔드에서 `collected_at`을 백엔드가 기대하는 형식으로 변환하여 전송

**수정 위치**: `src/lib/api/issues.ts`

```typescript
export const getAllJobIndices = async (
  collectedAt?: string
): Promise<T.AllJobIndicesResponse> => {
  try {
    let params: Record<string, string> = {};
    
    if (collectedAt) {
      // ISO 8601 전체 형식에서 날짜만 추출 (YYYY-MM-DD)
      const dateOnly = collectedAt.split('T')[0];
      params.collected_at = dateOnly;
      // 또는 params.date = dateOnly; (백엔드 파라미터명에 따라)
    }
    
    const { data } = await apiClient.get<T.AllJobIndicesResponse>(
      '/issue-index/jobs/all',
      { params }
    );
    return data;
  } catch (error: any) {
    console.error('[IssueAPI] getAllJobIndices failed:', error?.message);
    return { collected_at: new Date().toISOString(), jobs: [] };
  }
};
```

### 방안 B: 백엔드에서 날짜 파싱 유연화

백엔드에서 `collected_at` 파라미터를 받을 때 다양한 형식을 처리

---

## 4. 백엔드 팀 전달 사항

### 4.1 현재 프론트엔드 동작

| 항목 | 값 |
|------|-----|
| API 엔드포인트 | `GET /issue-index/jobs/all` |
| 파라미터명 | `collected_at` |
| 현재 전송 형식 | ISO 8601 전체 (`2025-01-15T14:30:00.000Z`) |
| 데이터 출처 | `/issue-index/current` API 응답의 `collected_at` 필드 |

### 4.2 백엔드 확인 필요 사항

1. **DB에서 직업별 이슈 지수의 PK(Primary Key) 형식 확인**
   - 날짜만 저장? (`2025-01-15`)
   - 전체 타임스탬프 저장? (`2025-01-15T14:30:00.000Z`)
   - 다른 형식?

2. **`/issue-index/jobs/all` API의 `collected_at` 파라미터 처리 방식 확인**
   - 정확히 일치해야 하는지?
   - 날짜만 비교하는지?
   - 범위 검색인지?

3. **`/issue-index/current` API 응답의 `collected_at`과 직업별 지수 DB의 PK 관계 확인**
   - 동일한 값인지?
   - 변환이 필요한지?

### 4.3 권장 해결 방향

**옵션 1 (프론트엔드 수정)**:
- 프론트엔드에서 `collected_at`을 날짜만 추출하여 전송 (`YYYY-MM-DD`)
- 백엔드는 현재 로직 유지

**옵션 2 (백엔드 수정)**:
- 백엔드에서 `collected_at` 파라미터를 파싱할 때 날짜 부분만 추출하여 DB 조회
- 프론트엔드는 현재 로직 유지

**옵션 3 (양쪽 협의)**:
- 명확한 날짜 형식 규약 정의 (예: 항상 `YYYY-MM-DD` 사용)
- API 문서에 형식 명시

### 4.4 디버깅을 위한 로그 확인

프론트엔드 콘솔에서 다음 로그를 확인할 수 있습니다:
```
[IssuePage] Job indices fetched with collected_at: <전송된 값> Result: <응답>
[IssueAPI] All job indices response: <상세 응답>
```

백엔드에서도 수신된 `collected_at` 파라미터 값과 DB 조회 쿼리를 로깅하여 비교해주세요.

---

## 5. 즉시 적용 가능한 프론트엔드 수정

백엔드 확인 전에 프론트엔드에서 시도해볼 수 있는 수정:

### 수정 1: 날짜만 추출하여 전송

**파일**: `src/lib/api/issues.ts`

```typescript
// 기존 코드
{ params: collectedAt ? { collected_at: collectedAt } : {} }

// 수정 코드
{ params: collectedAt ? { collected_at: collectedAt.split('T')[0] } : {} }
```

### 수정 2: 파라미터 없이 호출 (최신 데이터 자동 조회)

백엔드가 파라미터 없을 때 최신 데이터를 반환한다면:

**파일**: `src/components/IssuePage.tsx`

```typescript
// 기존 코드
fetchAllJobIndices(currentIndex.collected_at);

// 수정 코드 (파라미터 없이 호출)
fetchAllJobIndices();
```

---

## 6. 결론

**핵심 문제**: 프론트엔드가 전송하는 `collected_at` 형식과 백엔드 DB의 PK 형식 불일치

**권장 조치**:
1. 백엔드 팀에서 DB PK 형식 및 API 파라미터 처리 방식 확인
2. 형식 확인 후 프론트엔드 또는 백엔드 중 한 곳에서 형식 변환 적용
3. 향후 API 문서에 날짜 형식 명시

**프론트엔드 임시 조치**: `collected_at.split('T')[0]`으로 날짜만 추출하여 전송 시도
