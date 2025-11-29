// ==================== 공통 타입 ====================
export interface ApiResponse<T> {
  success: boolean;
  data: T;
}

// ==================== 이슈 지수 기본 타입 ====================

export interface TopCluster {
  cluster_id: string;
  topic_name: string;
  tags: string[];
  cluster_score: number;
  article_count: number;
}

export interface CurrentIssueIndex {
  collected_at: string;
  overall_index: number;
  active_clusters_count: number;
  inactive_clusters_count: number;
  total_articles_analyzed: number;
  top_clusters: TopCluster[];
}

export interface IssueIndexHistoryItem {
  collected_at: string;
  overall_index: number;
  active_clusters_count: number;
  inactive_clusters_count: number;
}

export interface ClusterSnapshot {
  cluster_id: string;
  topic_name: string;
  tags: string[];
  appearance_count: number;
  article_count: number;
  article_indices: number[];
  status: 'active' | 'inactive';
  cluster_score: number;
}

export interface Article {
  article_index: number;
  title: string;
  link: string;
  description: string;
  pub_date: string;
  source: string;
}

// ==================== 직업별 이슈 지수 타입 ====================

export interface JobIssueIndex {
  job_category: string;
  issue_index: number;
  active_clusters_count: number;
  inactive_clusters_count: number;
  total_articles_count: number;
}

export interface AllJobIndices {
  collected_at: string;
  jobs: JobIssueIndex[];
}

export interface JobCluster {
  cluster_id: string;
  topic_name: string;
  tags: string[];
  cluster_score: number;
  status: 'active' | 'inactive';
  article_count: number;
  article_indices: number[];
  appearance_count: number;
  match_ratio: number;
  weighted_score: number;
}

export interface JobClustersData {
  job_category: string;
  collected_at: string;
  clusters: JobCluster[];
  metadata: {
    total_clusters: number;
    total_articles: number;
  };
}

export interface JobArticle {
  index: number;
  cluster_id: string;
  topic_name: string;
  title: string;
  link: string;
  description: string;
  pub_date: string;
}

export interface JobArticlesData {
  job_category: string;
  collected_at: string;
  article_count: number;
  total_matched_articles: number;
  articles: JobArticle[];
}

// ==================== 직업 카테고리 상수 ====================

export const JOB_CATEGORIES = [
  '기술/개발',
  '창작/콘텐츠',
  '분석/사무',
  '의료/과학',
  '교육',
  '비즈니스',
  '제조/건설',
  '서비스',
  '창업/자영업',
  '농업/축산업',
  '어업/해상업',
  '학생',
  '기타',
] as const;

export type JobCategory = typeof JOB_CATEGORIES[number];

// ==================== API Response 타입 ====================

export type CurrentIssueIndexResponse = ApiResponse<CurrentIssueIndex>;
export type IssueIndexHistoryResponse = ApiResponse<IssueIndexHistoryItem[]>;
export type ClusterSnapshotResponse = ApiResponse<ClusterSnapshot[]>;
export type ArticlesResponse = ApiResponse<Article[]>;

export type AllJobIndicesResponse = AllJobIndices;
export type JobIssueIndexResponse = JobIssueIndex & { collected_at: string };
export type JobClustersResponse = JobClustersData;
export type JobArticlesResponse = JobArticlesData;

// ==================== UI State 타입 ====================

export interface IssuePageState {
  // 통합 대시보드
  currentIndex: CurrentIssueIndex | null;
  historyData: IssueIndexHistoryItem[];
  topClusters: TopCluster[];
  timeRange: '1d' | '7d' | '30d';

  // 직업별 지수
  allJobIndices: JobIssueIndex[];
  selectedJob: string | null;
  jobClusters: JobCluster[];

  // 주요 이슈 뉴스
  clusters: ClusterSnapshot[];
  filteredClusters: ClusterSnapshot[];
  selectedCluster: ClusterSnapshot | null;
  statusFilter: 'all' | 'active' | 'inactive';
  selectedTags: string[];
  collectedAt: string;

  // 로딩 상태
  isLoadingCurrent: boolean;
  isLoadingHistory: boolean;
  isLoadingJobs: boolean;
  isLoadingJobClusters: boolean;
  isLoadingClusters: boolean;

  // 에러
  error: string | null;
}

// ==================== 차트 데이터 타입 ====================

export interface IndexTrendData {
  time: string;
  fullTime: string;
  index: number;
  activeClusters: number;
}

export interface JobIndexChartData {
  jobName: string;
  score: number;
  isUserJob: boolean;
  activeClusters: number;
}
