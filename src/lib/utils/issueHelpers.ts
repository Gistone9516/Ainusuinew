import type {
  IssueIndexHistoryItem,
  ClusterSnapshot,
  JobIssueIndex,
  JobCategory,
  IndexTrendData,
  JobIndexChartData,
} from '../../types/issue';

// ==================== 날짜/시간 포맷팅 ====================

/**
 * 날짜+시간 포맷팅 (2025년 1월 1일 14:00)
 */
export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 날짜만 포맷팅 (2025년 1월 1일)
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
 * 시간만 포맷팅 (14:00)
 */
export const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * 간단한 날짜 포맷 (MM/DD)
 */
export const formatShortDate = (dateString: string): string => {
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${month}/${day}`;
};

// ==================== 지수 계산 및 분석 ====================

/**
 * 지수 변화율 계산
 */
export const calculateIndexChange = (
  current: number,
  previous: number
): {
  value: number;
  percentage: string;
  isPositive: boolean;
} => {
  const diff = current - previous;
  const percentage = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : '0.0';

  return {
    value: parseFloat(diff.toFixed(1)),
    percentage,
    isPositive: diff > 0,
  };
};

/**
 * 지수 레벨 결정 (공포/중립/탐욕)
 */
export const getIndexLevel = (index: number): {
  level: 'fear' | 'neutral' | 'greed';
  label: string;
  color: string;
  bgColor: string;
} => {
  if (index < 40) {
    return {
      level: 'fear',
      label: '공포',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    };
  } else if (index < 60) {
    return {
      level: 'neutral',
      label: '중립',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    };
  } else {
    return {
      level: 'greed',
      label: '탐욕',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    };
  }
};

// ==================== 데이터 필터링 ====================

/**
 * 24시간 데이터 필터링
 */
export const filter24HoursData = (
  data: IssueIndexHistoryItem[]
): IssueIndexHistoryItem[] => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return data.filter((item) => {
    const itemDate = new Date(item.collected_at);
    return itemDate >= oneDayAgo && itemDate <= now;
  });
};

/**
 * 활성 클러스터만 필터링
 */
export const filterActiveClusters = (
  clusters: ClusterSnapshot[]
): ClusterSnapshot[] => {
  return clusters.filter((cluster) => cluster.status === 'active');
};

/**
 * 태그로 클러스터 필터링
 */
export const filterClustersByTags = (
  clusters: ClusterSnapshot[],
  tags: string[]
): ClusterSnapshot[] => {
  if (tags.length === 0) return clusters;

  return clusters.filter((cluster) =>
    cluster.tags.some((tag) => tags.includes(tag))
  );
};

// ==================== 정렬 ====================

/**
 * 클러스터 점수별 정렬 (내림차순)
 */
export const sortClustersByScore = (
  clusters: ClusterSnapshot[]
): ClusterSnapshot[] => {
  return [...clusters].sort((a, b) => b.cluster_score - a.cluster_score);
};

/**
 * 직업 지수별 정렬 (내림차순)
 */
export const sortJobIndicesByScore = (
  jobs: JobIssueIndex[]
): JobIssueIndex[] => {
  return [...jobs].sort((a, b) => b.issue_index - a.issue_index);
};

// ==================== 차트 데이터 변환 ====================

/**
 * 히스토리 데이터를 차트용으로 변환
 */
export const formatHistoryForChart = (
  history: IssueIndexHistoryItem[]
): IndexTrendData[] => {
  return history.map((item) => ({
    time: formatTime(item.collected_at),
    fullTime: item.collected_at,
    index: item.overall_index,
    activeClusters: item.active_clusters_count,
  }));
};

/**
 * 직업 지수를 차트용으로 변환
 */
export const formatJobIndicesForChart = (
  jobs: JobIssueIndex[],
  userJob?: string
): JobIndexChartData[] => {
  return jobs.map((job) => ({
    jobName: job.job_category,
    score: job.issue_index,
    isUserJob: job.job_category === userJob,
    activeClusters: job.active_clusters_count,
  }));
};

// ==================== 페이지네이션 ====================

/**
 * 기사 인덱스 추출 (페이지네이션용)
 */
export const extractArticleIndices = (
  cluster: ClusterSnapshot,
  page: number = 1,
  pageSize: number = 10
): number[] => {
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  return cluster.article_indices.slice(start, end);
};

/**
 * 총 페이지 수 계산
 */
export const calculateTotalPages = (
  totalItems: number,
  pageSize: number
): number => {
  return Math.ceil(totalItems / pageSize);
};

// ==================== 직업 카테고리 매핑 ====================

/**
 * 사용자 입력 직업 → 표준 직업 카테고리 매핑
 */
export const mapUserJobToCategory = (userJob: string): JobCategory => {
  const mapping: Record<string, JobCategory> = {
    개발자: '기술/개발',
    '소프트웨어 개발': '기술/개발',
    'SW 개발': '기술/개발',
    프로그래머: '기술/개발',
    엔지니어: '기술/개발',

    디자이너: '창작/콘텐츠',
    작가: '창작/콘텐츠',
    '콘텐츠 크리에이터': '창작/콘텐츠',
    크리에이터: '창작/콘텐츠',

    '데이터 분석가': '분석/사무',
    '데이터 과학자': '분석/사무',
    사무직: '분석/사무',
    애널리스트: '분석/사무',

    의사: '의료/과학',
    간호사: '의료/과학',
    연구원: '의료/과학',
    과학자: '의료/과학',

    교사: '교육',
    강사: '교육',
    교수: '교육',
    교육자: '교육',

    마케터: '비즈니스',
    영업: '비즈니스',
    컨설턴트: '비즈니스',
    경영: '비즈니스',

    제조업: '제조/건설',
    건설업: '제조/건설',
    생산직: '제조/건설',

    서비스업: '서비스',
    판매직: '서비스',
    접객: '서비스',

    창업가: '창업/자영업',
    자영업: '창업/자영업',
    사업가: '창업/자영업',

    농업: '농업/축산업',
    축산업: '농업/축산업',
    농부: '농업/축산업',

    어업: '어업/해상업',
    해상업: '어업/해상업',
    선원: '어업/해상업',

    학생: '학생',
    대학생: '학생',
    고등학생: '학생',
  };

  return mapping[userJob] || '기타';
};

// ==================== 통계 계산 ====================

/**
 * 평균 지수 계산
 */
export const calculateAverageIndex = (
  history: IssueIndexHistoryItem[]
): number => {
  if (history.length === 0) return 0;
  const sum = history.reduce((acc, item) => acc + item.overall_index, 0);
  return parseFloat((sum / history.length).toFixed(1));
};

/**
 * 최고/최저 지수 찾기
 */
export const findMinMaxIndex = (
  history: IssueIndexHistoryItem[]
): {
  min: IssueIndexHistoryItem | null;
  max: IssueIndexHistoryItem | null;
} => {
  if (history.length === 0) return { min: null, max: null };

  const sorted = [...history].sort((a, b) => a.overall_index - b.overall_index);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
  };
};

/**
 * 모든 태그 추출 (중복 제거)
 */
export const extractAllTags = (clusters: ClusterSnapshot[]): string[] => {
  const tags = new Set<string>();
  clusters.forEach((cluster) => {
    cluster.tags.forEach((tag) => tags.add(tag));
  });
  return Array.from(tags).sort();
};
