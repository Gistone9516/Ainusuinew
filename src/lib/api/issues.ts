import apiClient from './client';
import type * as T from '../../types/issue';

// ==================== 기본 이슈 지수 API ====================

/**
 * 1. 현재 이슈 지수 조회 (메타데이터 포함)
 */
export const getCurrentIssueIndex = async (): Promise<T.CurrentIssueIndexResponseWithMeta> => {
  console.log('[IssueAPI] getCurrentIssueIndex called');
  try {
    const { data } = await apiClient.get<T.CurrentIssueIndexResponseWithMeta>(
      '/issue-index/current'
    );
    console.log('[IssueAPI] Response received:', JSON.stringify(data, null, 2));
    
    // 서버 응답 구조 정규화
    if (data && 'success' in data && 'data' in data) {
      return data;
    } else if (data && 'collected_at' in data) {
      console.log('[IssueAPI] Wrapping raw response');
      return { success: true, data: data as unknown as T.CurrentIssueIndex };
    }
    
    return data;
  } catch (error: any) {
    console.error('[IssueAPI] getCurrentIssueIndex failed:', error?.message);
    // 에러 시 기본 응답 반환
    return {
      success: false,
      data: {
        collected_at: '',
        overall_index: 0,
        active_clusters_count: 0,
        inactive_clusters_count: 0,
        total_articles_analyzed: 0,
        top_clusters: [],
      },
    };
  }
};

/**
 * 2. 과거 이슈 지수 조회 (범위 조회 지원)
 * @param startDate - YYYY-MM-DD 형식 (시작 날짜)
 * @param endDate - YYYY-MM-DD 형식 (종료 날짜, 선택)
 */
export const getIssueIndexHistory = async (
  startDate: string,
  endDate?: string
): Promise<T.IssueIndexHistoryResponseWithMeta> => {
  try {
    const params: Record<string, string> = {};
    
    // 범위 조회 지원: start_date, end_date 또는 기존 date 파라미터
    if (endDate) {
      params.start_date = startDate;
      params.end_date = endDate;
    } else {
      params.date = startDate;
    }
    
    const { data } = await apiClient.get<T.IssueIndexHistoryResponseWithMeta>(
      '/issue-index/history',
      { params }
    );
    console.log('[IssueAPI] History response:', JSON.stringify(data, null, 2));
    
    // 서버 응답 구조 정규화
    if (data && 'success' in data && 'data' in data) {
      return data;
    } else if (Array.isArray(data)) {
      return { success: true, data: data as T.IssueIndexHistoryItem[] };
    }
    
    return data;
  } catch (error: any) {
    console.error('[IssueAPI] History request failed:', error?.message);
    return { 
      success: false, 
      data: [],
      metadata: {
        requested_start: startDate,
        requested_end: endDate || startDate,
        actual_count: 0,
        missing_dates: [],
      }
    };
  }
};

/**
 * 3. 클러스터 스냅샷 조회 (에러 처리 포함)
 * @param collectedAt - ISO 8601 형식 시간
 */
export const getClusterSnapshot = async (
  collectedAt: string
): Promise<T.ClusterSnapshotResponseWithMeta> => {
  try {
    const { data } = await apiClient.get<T.ClusterSnapshotResponseWithMeta>(
      '/issue-index/clusters',
      { params: { collected_at: collectedAt } }
    );
    console.log('[IssueAPI] Clusters response:', JSON.stringify(data, null, 2));
    
    // 서버 응답 구조 정규화
    if (data && 'success' in data && 'data' in data) {
      return data;
    } else if (Array.isArray(data)) {
      return { 
        success: true, 
        data: data as T.ClusterSnapshot[],
        metadata: {
          collected_at: collectedAt,
          total_clusters: data.length,
          active_count: data.filter((c: T.ClusterSnapshot) => c.status === 'active').length,
          inactive_count: data.filter((c: T.ClusterSnapshot) => c.status === 'inactive').length,
        }
      };
    }
    
    return data;
  } catch (error: any) {
    console.error('[IssueAPI] Clusters request failed:', error?.message);
    return {
      success: false,
      data: [],
      metadata: {
        collected_at: collectedAt,
        total_clusters: 0,
        active_count: 0,
        inactive_count: 0,
        message: '클러스터 데이터를 불러오는데 실패했습니다.',
      }
    };
  }
};

/**
 * 4. 기사 원문 조회 (에러 처리 포함)
 * @param collectedAt - ISO 8601 형식 시간
 * @param indices - 기사 인덱스 배열
 */
export const getArticles = async (
  collectedAt: string,
  indices: number[]
): Promise<T.ArticlesResponse> => {
  console.log('[IssueAPI] getArticles called with:', { collectedAt, indices });
  
  try {
    const { data } = await apiClient.get<T.ArticlesResponse>(
      '/issue-index/articles',
      {
        params: {
          collected_at: collectedAt,
          indices: indices.join(','),
        },
      }
    );
    console.log('[IssueAPI] Articles response:', JSON.stringify(data, null, 2));
    
    // 서버 응답 구조 정규화
    if (data && 'success' in data && 'data' in data) {
      return data;
    } else if (Array.isArray(data)) {
      return { success: true, data: data as T.Article[] };
    }
    
    return data;
  } catch (error: any) {
    console.error('[IssueAPI] getArticles failed:', error?.message);
    return { success: false, data: [] };
  }
};

// ==================== 직업별 이슈 지수 API ====================

/**
 * 5. 전체 직업 이슈 지수 조회
 * @param collectedAt - (선택) ISO 8601 형식 시간
 */
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
    // 실패 시 기본값 반환
    return { collected_at: new Date().toISOString(), jobs: [] };
  }
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
 * 최근 N일 이슈 지수 조회 (범위 조회 API 사용)
 * @param days - 조회할 일수 (1, 7, 30)
 * @returns 히스토리 데이터와 메타데이터
 */
export const getRecentIssueIndices = async (
  days: number
): Promise<{
  data: T.IssueIndexHistoryItem[];
  metadata?: T.HistoryMetadata;
  hasData: boolean;
}> => {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const startDateStr = startDate.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  // 단일 범위 조회 API 호출 (더 이상 날짜별 개별 호출 안함)
  const response = await getIssueIndexHistory(startDateStr, endDateStr);

  // 시간순 정렬
  const sortedData = response.data.sort(
    (a, b) =>
      new Date(a.collected_at).getTime() - new Date(b.collected_at).getTime()
  );

  return {
    data: sortedData,
    metadata: response.metadata,
    hasData: sortedData.length > 0,
  };
};

/**
 * 날짜 범위로 이슈 지수 조회 (범위 조회 API 사용)
 * @param startDate - YYYY-MM-DD
 * @param endDate - YYYY-MM-DD
 */
export const getIssueIndexRange = async (
  startDate: string,
  endDate: string
): Promise<{
  data: T.IssueIndexHistoryItem[];
  metadata?: T.HistoryMetadata;
  hasData: boolean;
}> => {
  // 단일 범위 조회 API 호출
  const response = await getIssueIndexHistory(startDate, endDate);

  const sortedData = response.data.sort(
    (a, b) =>
      new Date(a.collected_at).getTime() - new Date(b.collected_at).getTime()
  );

  return {
    data: sortedData,
    metadata: response.metadata,
    hasData: sortedData.length > 0,
  };
};
