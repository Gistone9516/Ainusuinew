import type * as T from '../../types/model';
import { TASK_CATEGORY_NAMES } from '../../types/model';

// ==================== 날짜 포맷팅 ====================

/**
 * ISO 날짜를 한국어 형식으로 변환
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * ISO 날짜를 짧은 형식으로 변환 (YYYY.MM.DD)
 */
export const formatDateShort = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

/**
 * 상대 시간 표시 (예: "3일 전")
 */
export const formatRelativeTime = (dateString: string): string => {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return formatDateShort(dateString);
  } else if (diffDays > 0) {
    return `${diffDays}일 전`;
  } else if (diffHours > 0) {
    return `${diffHours}시간 전`;
  } else if (diffMins > 0) {
    return `${diffMins}분 전`;
  } else {
    return '방금 전';
  }
};

// ==================== 점수 포맷팅 ====================

/**
 * 점수를 소수점 1자리로 포맷
 */
export const formatScore = (score: number): string => {
  return score.toFixed(1);
};

/**
 * 점수를 백분율로 변환
 */
export const scoreToPercentage = (score: number, maxScore: number = 100): string => {
  const percentage = (score / maxScore) * 100;
  return `${percentage.toFixed(0)}%`;
};

/**
 * 점수 차이를 표시 (+/- 부호 포함)
 */
export const formatScoreDifference = (diff: number): string => {
  if (diff === 0) return '0';
  return diff > 0 ? `+${diff.toFixed(1)}` : `${diff.toFixed(1)}`;
};

/**
 * 점수에 따른 등급 반환
 */
export const getScoreGrade = (score: number): 'S' | 'A' | 'B' | 'C' | 'D' => {
  if (score >= 90) return 'S';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
};

// ==================== 가격 포맷팅 ====================

/**
 * 가격을 USD 형식으로 포맷
 */
export const formatPrice = (price: number): string => {
  return `$${price.toFixed(2)}`;
};

/**
 * 가격을 M tokens 기준으로 표시
 */
export const formatPricePerMillion = (price: number): string => {
  return `$${price.toFixed(2)}/M`;
};

/**
 * 가격 차이를 표시 (+/- 부호, 절대값 기준)
 */
export const formatPriceDifference = (diff: number): string => {
  const absDiff = Math.abs(diff);
  if (diff === 0) return '$0';
  return diff > 0 ? `+$${absDiff.toFixed(2)}` : `-$${absDiff.toFixed(2)}`;
};

/**
 * blended 가격 계산 (3:1 비율)
 */
export const calculateBlendedPrice = (
  inputPrice: number,
  outputPrice: number,
  ratio: number = 3
): number => {
  return (inputPrice * ratio + outputPrice) / (ratio + 1);
};

// ==================== 차트 데이터 변환 ====================

/**
 * 벤치마크 비교 데이터를 차트용으로 변환
 */
export const transformBenchmarkComparisonForChart = (
  benchmarks: T.BenchmarkComparison[]
): Array<{
  name: string;
  modelA: number;
  modelB: number;
}> => {
  return benchmarks.map((b) => ({
    name: b.benchmark_name,
    modelA: b.model_a_score,
    modelB: b.model_b_score,
  }));
};

/**
 * 타임라인 데이터를 차트용으로 변환
 */
export const transformTimelineForChart = (
  timeline: T.TimelineEvent[]
): Array<{
  date: string;
  score: number;
  modelName: string;
}> => {
  return timeline.map((event) => ({
    date: formatDateShort(event.release_date),
    score: event.overall_score,
    modelName: event.model_name,
  }));
};

/**
 * 벤치마크 점수 기여도 계산
 */
export const calculateContributions = (
  benchmarkScores: T.BenchmarkScores
): T.BenchmarkContributionData[] => {
  return [
    {
      benchmark: benchmarkScores.primary.name,
      contribution: benchmarkScores.primary.contribution,
      weight: benchmarkScores.primary.weight,
    },
    {
      benchmark: benchmarkScores.secondary.name,
      contribution: benchmarkScores.secondary.contribution,
      weight: benchmarkScores.secondary.weight,
    },
  ];
};

// ==================== 문자열 처리 ====================

/**
 * 모델 슬러그 생성
 */
export const createModelSlug = (modelName: string): string => {
  return modelName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
};

/**
 * 카테고리 코드를 한글 이름으로 변환
 */
export const getCategoryNameKo = (code: T.TaskCategoryCode): string => {
  return TASK_CATEGORY_NAMES[code] || code;
};

/**
 * 벤치마크 이름을 한글로 변환 (필요시 매핑)
 */
export const getBenchmarkDisplayName = (benchmarkName: string): string => {
  const mapping: Record<string, string> = {
    MMLU_PRO: 'MMLU Pro',
    LiveCodeBench: 'LiveCodeBench',
    HumanEval: 'HumanEval',
    GSM8K: 'GSM8K',
    MATH: 'MATH',
    MGSM: 'MGSM',
  };
  return mapping[benchmarkName] || benchmarkName;
};

// ==================== 추천 모델 처리 ====================

/**
 * 추천 모델을 점수순으로 정렬
 */
export const sortModelsByScore = (
  models: T.RecommendedModel[]
): T.RecommendedModel[] => {
  return [...models].sort((a, b) => b.weighted_score - a.weighted_score);
};

/**
 * 추천 모델에서 상위 N개 추출
 */
export const getTopModels = (
  models: T.RecommendedModel[],
  count: number = 3
): T.RecommendedModel[] => {
  return sortModelsByScore(models).slice(0, count);
};

// ==================== 타임라인 처리 ====================

/**
 * 여러 시리즈의 타임라인을 병합하고 날짜순 정렬
 */
export const mergeTimelines = (
  timelines: Array<{ series: string; events: T.TimelineEvent[] }>
): Array<T.TimelineEvent & { series: string }> => {
  const merged: Array<T.TimelineEvent & { series: string }> = [];

  timelines.forEach((timeline) => {
    timeline.events.forEach((event) => {
      merged.push({
        ...event,
        series: timeline.series,
      });
    });
  });

  return merged.sort(
    (a, b) =>
      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
  );
};

/**
 * 타임라인에서 특정 기간만 필터링
 */
export const filterTimelineByDateRange = (
  timeline: T.TimelineEvent[],
  startDate: string,
  endDate: string
): T.TimelineEvent[] => {
  const start = new Date(startDate).getTime();
  const end = new Date(endDate).getTime();

  return timeline.filter((event) => {
    const date = new Date(event.release_date).getTime();
    return date >= start && date <= end;
  });
};

// ==================== 비교 헬퍼 ====================

/**
 * 두 모델의 승자 판단
 */
export const determineWinner = (
  scoreA: number,
  scoreB: number,
  threshold: number = 0.5
): 'model_a' | 'model_b' | 'tie' => {
  const diff = scoreA - scoreB;
  if (Math.abs(diff) < threshold) return 'tie';
  return diff > 0 ? 'model_a' : 'model_b';
};

/**
 * 비교 요약 문구 생성
 */
export const generateComparisonSummary = (
  modelA: T.ComparisonModel,
  modelB: T.ComparisonModel
): string => {
  const winner = determineWinner(
    modelA.overall_score,
    modelB.overall_score
  );

  if (winner === 'tie') {
    return `${modelA.model_name}과 ${modelB.model_name}은 비슷한 성능을 보입니다.`;
  }

  const winnerModel = winner === 'model_a' ? modelA : modelB;
  const loserModel = winner === 'model_a' ? modelB : modelA;
  const diff = Math.abs(winnerModel.overall_score - loserModel.overall_score);

  return `${winnerModel.model_name}이 ${loserModel.model_name}보다 ${diff.toFixed(1)}점 높은 성능을 보입니다.`;
};

// ==================== 신뢰도/통계 처리 ====================

/**
 * 신뢰도 점수를 퍼센트 문자열로 변환
 */
export const formatConfidence = (confidence: number): string => {
  return `${(confidence * 100).toFixed(0)}%`;
};

/**
 * 신뢰도 등급 반환
 */
export const getConfidenceLevel = (
  confidence: number
): 'high' | 'medium' | 'low' => {
  if (confidence >= 0.8) return 'high';
  if (confidence >= 0.6) return 'medium';
  return 'low';
};

// ==================== 에러 처리 ====================

/**
 * API 에러 메시지 추출
 */
export const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  if (error.message) {
    return error.message;
  }
  return '알 수 없는 오류가 발생했습니다.';
};

/**
 * 에러 코드에 따른 사용자 친화적 메시지
 */
export const getUserFriendlyErrorMessage = (errorCode?: number): string => {
  const messages: Record<number, string> = {
    400: '잘못된 요청입니다. 입력값을 확인해주세요.',
    401: '로그인이 필요합니다.',
    403: '접근 권한이 없습니다.',
    404: '요청한 데이터를 찾을 수 없습니다.',
    500: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
  };

  return errorCode ? messages[errorCode] || messages[500] : messages[500];
};
