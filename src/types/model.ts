// ==================== 공통 타입 ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp?: string;
  workflow_id?: string;
}

// ==================== 25개 작업 카테고리 상수 ====================
export const TASK_CATEGORIES = [
  'writing',
  'image_generation_editing',
  'coding',
  'video_production',
  'audio_music',
  'translation',
  'summarization',
  'research',
  'learning',
  'brainstorming',
  'analysis',
  'customer_service',
  'design',
  'marketing',
  'cooking',
  'fitness',
  'travel_planning',
  'schedule_planning',
  'math_science',
  'legal',
  'finance',
  'hr_recruitment',
  'presentation',
  'gaming',
  'voice_action',
] as const;

export type TaskCategoryCode = typeof TASK_CATEGORIES[number];

// 작업 카테고리 한글 매핑
export const TASK_CATEGORY_NAMES: Record<TaskCategoryCode, string> = {
  writing: '글쓰기',
  image_generation_editing: '이미지 작업',
  coding: '코딩/개발',
  video_production: '영상 제작',
  audio_music: '음악/오디오',
  translation: '번역',
  summarization: '요약/정리',
  research: '연구/조사',
  learning: '학습/교육',
  brainstorming: '창작/아이디어',
  analysis: '분석',
  customer_service: '고객 응대',
  design: '디자인/UI-UX',
  marketing: '마케팅',
  cooking: '요리',
  fitness: '운동/피트니스',
  travel_planning: '여행 계획',
  schedule_planning: '일정 관리',
  math_science: '수학/과학',
  legal: '법률/계약',
  finance: '재무/회계',
  hr_recruitment: '인적자원/채용',
  presentation: '프레젠테이션',
  gaming: '게임',
  voice_action: '음성 명령/작업',
};

// ==================== 작업 분류 타입 ====================
export interface TaskCategory {
  task_category_id: number;
  category_code: TaskCategoryCode;
  category_name_ko: string;
  category_name_en: string;
  description: string;
  keywords: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TaskClassification {
  task_category_id: number;
  category_code: TaskCategoryCode;
  category_name_ko: string;
  category_name_en: string;
  confidence_score: number;
  reasoning: string;
}

// ==================== 모델 추천 타입 ====================
// Note: score and contribution can be string or number as API may return either type
export interface BenchmarkScore {
  name: string;
  score: string | number;
  weight: number;
  contribution: string | number;
}

export interface BenchmarkScores {
  primary: BenchmarkScore;
  secondary: BenchmarkScore;
}

export interface ModelPricing {
  input_price: number;
  output_price: number;
}

// Note: weighted_score can be string or number as API may return either type
export interface RecommendedModel {
  rank: number;
  model_id: string;
  model_name: string;
  creator_name: string;
  weighted_score: string | number;
  benchmark_scores: BenchmarkScores;
  overall_score: number;
  pricing: ModelPricing;
}

export interface RecommendationCriteria {
  primary_benchmark: string;
  secondary_benchmark: string;
  weights: {
    primary: number;
    secondary: number;
  };
}

export interface RecommendationMetadata {
  total_models_evaluated: number;
  classification_time_ms: number;
  recommendation_time_ms: number;
}

// ==================== 통합 응답 타입 ====================
export interface ClassifyAndRecommendResponse {
  classification: TaskClassification;
  criteria: RecommendationCriteria;
  recommended_models: RecommendedModel[];
  metadata: RecommendationMetadata;
}

// ==================== 모델 기본 타입 ====================
export interface Model {
  model_id: string;
  model_name: string;
  model_slug: string;
  creator_name: string;
  release_date: string;
  model_type: string;
  parameter_size: string;
  context_length: number;
  is_open_source: boolean;
}

export interface ModelDetail extends Model {
  creator: {
    creator_id: string;
    creator_name: string;
    website_url: string;
  };
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== 모델 벤치마크 평가 ====================
export interface BenchmarkEvaluation {
  benchmark_name: string;
  score: number;
  max_score: number;
  normalized_score: number;
  model_rank: number;
  measured_at: string;
}

// ==================== 모델 종합 점수 ====================
export interface ModelOverallScore {
  overall_score: number;
  intelligence_index: number;
  coding_index: number;
  math_index: number;
  reasoning_index: number;
  language_index: number;
  calculated_at: string;
  version: number;
}

// ==================== 모델 가격 정보 ====================
export interface ModelPricingDetail {
  price_input_1m: number;
  price_output_1m: number;
  price_blended_3to1: number;
  currency: string;
  effective_date: string;
  is_current: boolean;
}

// ==================== 모델 비교 타입 ====================

// 키 벤치마크 항목
export interface KeyBenchmark {
  name: string;
  display_name: string;
  score: string;
  normalized_score: string;
  category: string;
}

// 모델 가격 정보 (비교용)
export interface ComparisonPricing {
  price_input_1m: string;
  price_output_1m: string;
  price_blended_3to1: string;
  currency: string;
}

// 모델 점수 정보
export interface ModelScores {
  intelligence: number;
  coding: number;
  math: number;
  reasoning: number;
  language: number;
}

// 비교용 모델 정보
export interface ComparisonModel {
  model_id: string;
  model_name: string;
  model_slug: string;
  creator_name: string;
  release_date: string;
  parameter_size: string | null;
  context_length: number | null;
  is_open_source: number;
  pricing: ComparisonPricing;
  overall_score: string;
  scores: ModelScores;
  key_benchmarks: KeyBenchmark[];
  strengths: string[];
  weaknesses: string[];
}

// 점수 차이
export interface ScoreDifferences {
  overall: number;
  intelligence: number;
  coding: number;
  math: number;
  reasoning: number;
  language: number;
}

// 가격 비교
export interface PriceComparison {
  model_a_price: string;
  model_b_price: string;
  cheaper_model: string;
}

// 비교 요약
export interface ComparisonSummary {
  winner_overall: string;
  winner_intelligence: string;
  winner_coding: string;
  winner_math: string;
  winner_reasoning: string;
  winner_language: string;
  score_differences: ScoreDifferences;
  price_comparison: PriceComparison;
  recommendation: string;
}

// 막대 차트 데이터
export interface BarChartDataItem {
  category: string;
  display_name: string;
  model_a_score: string | number;
  model_b_score: string | number;
  difference: number;
  winner: string;
}

// 레이더 차트 데이터
export interface RadarChartData {
  categories: string[];
  model_a_values: number[];
  model_b_values: number[];
}

// 시각화 데이터
export interface VisualData {
  bar_chart_data: BarChartDataItem[];
  radar_chart_data: RadarChartData;
  performance_gap: number;
}

// 모델 비교 전체 구조
export interface ModelComparison {
  model_a: ComparisonModel;
  model_b: ComparisonModel;
  comparison_summary: ComparisonSummary;
  visual_data: VisualData;
}

// ==================== 타임라인 타입 ====================
export interface TimelineEvent {
  model_name: string;
  release_date: string;
  overall_score: number;
  major_improvements: string[];
}

export interface SeriesTimeline {
  series: string;
  timeline: TimelineEvent[];
}

export interface SeriesInfo {
  series_name: string;
  model_count: number;
  latest_model: string;
  latest_release: string;
}

export interface TimelineComparison {
  compared_series: string[];
  timeline_comparison: Array<{
    date: string;
    events: Array<{
      series: string;
      model_name: string;
      event: string;
      overall_score: number;
    }>;
  }>;
}

export interface BenchmarkProgression {
  series: string;
  benchmark: string;
  progression: Array<{
    model_name: string;
    release_date: string;
    score: number;
    improvement_from_previous: number | null;
  }>;
}

export interface ReleaseEvent {
  model_name: string;
  creator_name: string;
  release_date: string;
  event_type: 'major_release' | 'minor_update' | 'patch';
  significance: 'high' | 'medium' | 'low';
}

// ==================== 페이지네이션 타입 ====================
export interface PaginatedModels {
  items: Model[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

// ==================== 직업별 모델 추천 ====================

// 벤치마크 점수 정보
// Note: score can be string or number as API may return either type
export interface BenchmarkScoreInfo {
  name: string;
  score: string | number;
  weight: number;
}

// 추천 모델 정보
// Note: weighted_score can be string or number as API may return either type
export interface JobRecommendation {
  rank: number;
  model_id: string;
  model_name: string;
  model_slug: string;
  creator_name: string;
  creator_slug: string;
  weighted_score: string | number;
  benchmark_scores: {
    primary: BenchmarkScoreInfo;
    secondary: BenchmarkScoreInfo;
  };
}

export interface JobRecommendationResponse {
  job_category: {
    job_category_id: number;
    job_name: string;
    category_code: string;
  };
  criteria: {
    primary_benchmark: string;
    secondary_benchmark: string;
    weights: {
      primary: number;
      secondary: number;
    };
  };
  recommended_models: JobRecommendation[];
}

// ==================== API Response 타입 ====================
export type TaskCategoriesResponse = ApiResponse<TaskCategory[]>;
export type TaskClassificationResponse = ApiResponse<TaskClassification>;
export type ClassifyAndRecommendApiResponse = ApiResponse<ClassifyAndRecommendResponse>;
export type ModelsResponse = ApiResponse<PaginatedModels>;
export type ModelDetailResponse = ApiResponse<ModelDetail>;
export type ModelComparisonResponse = ApiResponse<ModelComparison>;
export type SeriesTimelineResponse = ApiResponse<SeriesTimeline>;
export type AvailableSeriesResponse = ApiResponse<SeriesInfo[]>;
export type TimelineComparisonResponse = ApiResponse<TimelineComparison>;
export type BenchmarkProgressionResponse = ApiResponse<BenchmarkProgression>;
export type ReleaseEventsResponse = ApiResponse<ReleaseEvent[]>;
export type JobRecommendationApiResponse = ApiResponse<JobRecommendationResponse>;
export type BenchmarkEvaluationsResponse = ApiResponse<BenchmarkEvaluation[]>;
export type ModelOverallScoreResponse = ApiResponse<ModelOverallScore>;
export type ModelPricingResponse = ApiResponse<ModelPricingDetail>;

// ==================== UI State 타입 ====================
export interface TaskRecommendationState {
  // 입력
  userInput: string;
  isInputValid: boolean;

  // 분류 결과
  classification: TaskClassification | null;
  isClassifying: boolean;

  // 추천 결과
  recommendedModels: RecommendedModel[];
  criteria: RecommendationCriteria | null;
  metadata: RecommendationMetadata | null;
  isRecommending: boolean;

  // 에러
  error: string | null;

  // 히스토리
  searchHistory: TaskSearchHistory[];
}

export interface TaskSearchHistory {
  id: string;
  timestamp: string;
  userInput: string;
  classification: TaskClassification;
  topModel: RecommendedModel;
}

// ==================== 차트 데이터 타입 ====================
export interface ModelComparisonChartData {
  modelName: string;
  weightedScore: number;
  primaryScore: number;
  secondaryScore: number;
  overallScore: number;
}

export interface BenchmarkContributionData {
  benchmark: string;
  contribution: number;
  weight: number;
}
