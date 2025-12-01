import apiClient from './client';
import type * as T from '../../types/model';

// ==================== 작업 분류 및 추천 API ====================

/**
 * 1. 작업 분류만 수행
 */
export const classifyTask = async (
  userInput: string
): Promise<T.TaskClassificationResponse> => {
  const { data } = await apiClient.post<T.TaskClassificationResponse>(
    '/tasks/classify',
    { user_input: userInput }
  );
  return data;
};

/**
 * 2. 작업 분류 + 모델 추천 (통합)
 */
export const classifyAndRecommend = async (
  userInput: string,
  limit: number = 5
): Promise<T.ClassifyAndRecommendApiResponse> => {
  try {
    const { data } = await apiClient.post<T.ClassifyAndRecommendApiResponse>(
      '/tasks/classify-and-recommend',
      { user_input: userInput, limit }
    );
    console.log('[ModelAPI] classifyAndRecommend response:', data);
    return data;
  } catch (error: any) {
    console.error('[ModelAPI] classifyAndRecommend failed:', error?.message);
    throw error;
  }
};

/**
 * 3. 작업 카테고리 목록 조회
 */
export const getTaskCategories = async (): Promise<T.TaskCategoriesResponse> => {
  const { data } = await apiClient.get<T.TaskCategoriesResponse>(
    '/tasks/categories'
  );
  return data;
};

/**
 * 4. 특정 카테고리로 모델 추천
 */
export const getModelsByCategoryCode = async (
  categoryCode: T.TaskCategoryCode,
  limit: number = 3
): Promise<T.ClassifyAndRecommendApiResponse> => {
  const { data } = await apiClient.get<T.ClassifyAndRecommendApiResponse>(
    `/tasks/categories/${categoryCode}/recommend`,
    { params: { limit } }
  );
  return data;
};

// ==================== 모델 목록 및 상세 API ====================

/**
 * 5. 모델 목록 조회 (페이지네이션)
 */
export const getModels = async (params?: {
  page?: number;
  limit?: number;
  is_active?: boolean;
}): Promise<T.ModelsResponse> => {
  try {
    const { data } = await apiClient.get<T.ModelsResponse>('/models', {
      params: {
        page: params?.page || 1,
        limit: params?.limit || 20,
        is_active: params?.is_active !== false,
      },
    });
    console.log('[ModelAPI] getModels response:', data);
    return data;
  } catch (error: any) {
    console.error('[ModelAPI] getModels failed:', error?.message);
    throw error;
  }
};

/**
 * 6. 모델 상세 조회
 */
export const getModelDetail = async (
  modelId: string
): Promise<T.ModelDetailResponse> => {
  try {
    const { data } = await apiClient.get<T.ModelDetailResponse>(
      `/models/${modelId}`
    );
    console.log('[ModelAPI] getModelDetail response:', data);
    return data;
  } catch (error: any) {
    console.error('[ModelAPI] getModelDetail failed:', error?.message);
    throw error;
  }
};

/**
 * 7. 모델 벤치마크 평가 조회
 */
export const getModelEvaluations = async (
  modelId: string
): Promise<T.BenchmarkEvaluationsResponse> => {
  const { data } = await apiClient.get<T.BenchmarkEvaluationsResponse>(
    `/models/${modelId}/evaluations`
  );
  return data;
};

/**
 * 8. 모델 종합 점수 조회
 */
export const getModelOverallScore = async (
  modelId: string,
  version?: number
): Promise<T.ModelOverallScoreResponse> => {
  const { data } = await apiClient.get<T.ModelOverallScoreResponse>(
    `/models/${modelId}/overall-scores`,
    { params: version ? { version } : undefined }
  );
  return data;
};

/**
 * 9. 모델 가격 정보 조회
 */
export const getModelPricing = async (
  modelId: string,
  current: boolean = true
): Promise<T.ModelPricingResponse> => {
  const { data } = await apiClient.get<T.ModelPricingResponse>(
    `/models/${modelId}/pricing`,
    { params: { current } }
  );
  return data;
};

// ==================== 직업별 모델 추천 API ====================

/**
 * 10. 직업별 모델 추천
 */
export const getModelsByJobCategory = async (params: {
  job_category_id?: number;
  job_category_code?: string;
  limit?: number;
}): Promise<T.JobRecommendationApiResponse> => {
  try {
    const { data } = await apiClient.get<T.JobRecommendationApiResponse>(
      '/models/recommend',
      {
        params: {
          job_category_id: params.job_category_id,
          job_category_code: params.job_category_code,
          limit: params.limit || 3,
        },
      }
    );
    console.log('[ModelAPI] getModelsByJobCategory response:', data);
    return data;
  } catch (error: any) {
    console.error('[ModelAPI] getModelsByJobCategory failed:', error?.message);
    throw error;
  }
};

// ==================== 모델 비교 API ====================

/**
 * 11. 두 모델 비교
 */
export const compareModels = async (
  modelAId: string,
  modelBId: string
): Promise<T.ModelComparisonResponse> => {
  const { data } = await apiClient.get<T.ModelComparisonResponse>(
    '/comparison/compare',
    {
      params: {
        modelA: modelAId,
        modelB: modelBId,
      },
    }
  );
  console.log('[ModelAPI] compareModels response:', JSON.stringify(data, null, 2));
  return data;
};

/**
 * 12. 간편 비교 (모델명으로)
 */
export const quickCompareModels = async (
  nameA: string,
  nameB: string
): Promise<T.ModelComparisonResponse & { matched: { model_a: string; model_b: string } }> => {
  const { data } = await apiClient.get<T.ModelComparisonResponse & { matched: { model_a: string; model_b: string } }>(
    '/comparison/quick-compare',
    {
      params: {
        nameA,
        nameB,
      },
    }
  );
  return data;
};

/**
 * 13. 카테고리별 상위 모델
 */
export const getTopModelsByCategory = async (
  category: 'overall' | 'intelligence' | 'coding' | 'math',
  limit: number = 10
): Promise<ApiResponse<Array<{
  model_id: string;
  model_name: string;
  creator_name: string;
  score: number;
  rank: number;
}>>> => {
  const { data } = await apiClient.get<ApiResponse<Array<{
    model_id: string;
    model_name: string;
    creator_name: string;
    score: number;
    rank: number;
  }>>>(
    `/comparison/top/${category}`,
    { params: { limit } }
  );
  return data;
};

// ==================== 타임라인 API ====================

/**
 * 14. 사용 가능한 시리즈 목록
 */
export const getAvailableSeries = async (): Promise<T.AvailableSeriesResponse> => {
  const { data } = await apiClient.get<T.AvailableSeriesResponse>(
    '/timeline/series'
  );
  return data;
};

/**
 * 15. 모델 시리즈 타임라인
 */
export const getSeriesTimeline = async (
  series: string,
  limit: number = 20
): Promise<T.SeriesTimelineResponse> => {
  const { data } = await apiClient.get<T.SeriesTimelineResponse>(
    `/timeline/${series}`,
    { params: { limit } }
  );
  return data;
};

/**
 * 16. 여러 시리즈 비교
 */
export const compareSeriesTimeline = async (
  seriesList: string[]
): Promise<T.TimelineComparisonResponse> => {
  const { data } = await apiClient.get<T.TimelineComparisonResponse>(
    '/timeline/compare',
    {
      params: {
        series: seriesList.join(','),
      },
    }
  );
  return data;
};

/**
 * 17. 주요 출시 이벤트
 */
export const getReleaseEvents = async (
  startDate: string,
  endDate: string
): Promise<T.ReleaseEventsResponse> => {
  const { data } = await apiClient.get<T.ReleaseEventsResponse>(
    '/timeline/events',
    {
      params: {
        startDate,
        endDate,
      },
    }
  );
  return data;
};

/**
 * 18. 벤치마크별 발전 추이
 */
export const getBenchmarkProgression = async (
  series: string,
  benchmark: string
): Promise<T.BenchmarkProgressionResponse> => {
  const { data } = await apiClient.get<T.BenchmarkProgressionResponse>(
    `/timeline/benchmark/${series}/${benchmark}`
  );
  return data;
};

// ==================== 헬퍼 타입 ====================
interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
  workflow_id?: string;
}
