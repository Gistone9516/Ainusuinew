import apiClient from './client';
import type * as T from '../../types/issue';

// ==================== 기본 이슈 지수 API ====================

/**
 * 1. 현재 이슈 지수 조회
 */
export const getCurrentIssueIndex = async (): Promise<T.CurrentIssueIndexResponse> => {
  const { data } = await apiClient.get<T.CurrentIssueIndexResponse>(
    '/issue-index/current'
  );
  return data;
};

/**
 * 2. 과거 이슈 지수 조회 (특정 날짜)
 * @param date - YYYY-MM-DD 형식
 */
export const getIssueIndexHistory = async (
  date: string
): Promise<T.IssueIndexHistoryResponse> => {
  const { data } = await apiClient.get<T.IssueIndexHistoryResponse>(
    '/issue-index/history',
    { params: { date } }
  );
  return data;
};

/**
 * 3. 클러스터 스냅샷 조회
 * @param collectedAt - ISO 8601 형식 시간
 */
export const getClusterSnapshot = async (
  collectedAt: string
): Promise<T.ClusterSnapshotResponse> => {
  const { data } = await apiClient.get<T.ClusterSnapshotResponse>(
    '/issue-index/clusters',
    { params: { collected_at: collectedAt } }
  );
  return data;
};

/**
 * 4. 기사 원문 조회
 * @param collectedAt - ISO 8601 형식 시간
 * @param indices - 기사 인덱스 배열
 */
export const getArticles = async (
  collectedAt: string,
  indices: number[]
): Promise<T.ArticlesResponse> => {
  const { data } = await apiClient.get<T.ArticlesResponse>(
    '/issue-index/articles',
    {
      params: {
        collected_at: collectedAt,
        indices: indices.join(','),
      },
    }
  );
  return data;
};

// ==================== 직업별 이슈 지수 API ====================

/**
 * 5. 전체 직업 이슈 지수 조회
 * @param collectedAt - (선택) ISO 8601 형식 시간
 */
export const getAllJobIndices = async (
  collectedAt?: string
): Promise<T.AllJobIndicesResponse> => {
  const { data } = await apiClient.get<T.AllJobIndicesResponse>(
    '/issue-index/jobs/all',
    { params: collectedAt ? { collected_at: collectedAt } : {} }
  );
  return data;
};

/**
 * 6. 특정 직업 이슈 지수 조회
 * @param category - 직업 카테고리
 * @param collectedAt - (선택) ISO 8601 형식 시간
 */
export const getJobIssueIndex = async (
  category: string,
  collectedAt?: string
): Promise<T.JobIssueIndexResponse> => {
  const { data } = await apiClient.get<T.JobIssueIndexResponse>(
    `/issue-index/job/${encodeURIComponent(category)}`,
    { params: collectedAt ? { collected_at: collectedAt } : {} }
  );
  return data;
};

/**
 * 7. 직업별 매칭 클러스터 조회
 * @param category - 직업 카테고리
 * @param collectedAt - (선택) ISO 8601 형식 시간
 * @param status - (선택) active | inactive | all
 */
export const getJobClusters = async (
  category: string,
  collectedAt?: string,
  status?: 'active' | 'inactive' | 'all'
): Promise<T.JobClustersResponse> => {
  const { data } = await apiClient.get<T.JobClustersResponse>(
    `/issue-index/job/${encodeURIComponent(category)}/clusters`,
    {
      params: {
        ...(collectedAt && { collected_at: collectedAt }),
        ...(status && { status }),
      },
    }
  );
  return data;
};

/**
 * 8. 직업별 매칭 기사 조회
 * @param category - 직업 카테고리
 * @param params - 추가 파라미터
 */
export const getJobArticles = async (
  category: string,
  params?: {
    collectedAt?: string;
    clusterId?: string;
    limit?: number;
  }
): Promise<T.JobArticlesResponse> => {
  const { data } = await apiClient.get<T.JobArticlesResponse>(
    `/issue-index/job/${encodeURIComponent(category)}/articles`,
    {
      params: {
        ...(params?.collectedAt && { collected_at: params.collectedAt }),
        ...(params?.clusterId && { cluster_id: params.clusterId }),
        limit: params?.limit || 100,
      },
    }
  );
  return data;
};

// ==================== 헬퍼 함수 ====================

/**
 * 최근 N일 이슈 지수 조회
 * @param days - 조회할 일수 (1, 7, 30)
 */
export const getRecentIssueIndices = async (
  days: number
): Promise<T.IssueIndexHistoryItem[]> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const dates: string[] = [];
  for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  const promises = dates.map((date) => getIssueIndexHistory(date));
  const results = await Promise.all(promises);

  // 모든 결과 병합 및 시간순 정렬
  return results
    .flatMap((result) => result.data)
    .sort(
      (a, b) =>
        new Date(a.collected_at).getTime() - new Date(b.collected_at).getTime()
    );
};

/**
 * 날짜 범위로 이슈 지수 조회
 * @param startDate - YYYY-MM-DD
 * @param endDate - YYYY-MM-DD
 */
export const getIssueIndexRange = async (
  startDate: string,
  endDate: string
): Promise<T.IssueIndexHistoryItem[]> => {
  const dates = generateDateRange(startDate, endDate);
  const promises = dates.map((date) => getIssueIndexHistory(date));
  const results = await Promise.all(promises);

  return results
    .flatMap((result) => result.data)
    .sort(
      (a, b) =>
        new Date(a.collected_at).getTime() - new Date(b.collected_at).getTime()
    );
};

// 날짜 범위 생성
function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const start = new Date(startDate);
  const end = new Date(endDate);

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split('T')[0]);
  }

  return dates;
}
