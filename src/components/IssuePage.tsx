import { useState, useEffect, useMemo } from 'react';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { TrendingUp, Briefcase, Newspaper, Activity, BarChart3, Clock, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, Minus, Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import type { UserData, Page } from '../App';
import { AppHeader } from './AppHeader';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import * as IssueAPI from '../lib/api/issues';
import * as IssueHelpers from '../lib/utils/issueHelpers';
import type {
  CurrentIssueIndex,
  IssueIndexHistoryItem,
  JobIssueIndex,
  ClusterSnapshot,
  HistoryMetadata,
  ClusterMetadata
} from '../types/issue';

interface IssuePageProps {
  userData: UserData;
  onNavigate: (page: Page) => void;
  onSelectCluster: (cluster: any) => void;
}

export function IssuePage({ userData, onNavigate, onSelectCluster }: IssuePageProps) {
  const [selectedTab, setSelectedTab] = useState('integrated');
  const [trendPeriod, setTrendPeriod] = useState<'7d' | '30d'>('7d');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [showAllClusters, setShowAllClusters] = useState(false);
  const totalSlides = 3;

  // API State
  const [currentIndex, setCurrentIndex] = useState<CurrentIssueIndex | null>(null);
  const [historyData, setHistoryData] = useState<IssueIndexHistoryItem[]>([]);
  const [allJobIndices, setAllJobIndices] = useState<JobIssueIndex[]>([]);
  const [clusters, setClusters] = useState<ClusterSnapshot[]>([]);

  // Metadata State (데이터 가용성 정보)
  const [historyMetadata, setHistoryMetadata] = useState<HistoryMetadata | null>(null);
  const [clusterMetadata, setClusterMetadata] = useState<ClusterMetadata | null>(null);

  // Loading States
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(true);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isLoadingJobs, setIsLoadingJobs] = useState(false);
  const [isLoadingClusters, setIsLoadingClusters] = useState(false);

  // Error States
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [clustersError, setClustersError] = useState<string | null>(null);

  // Data availability
  const [hasCurrentData, setHasCurrentData] = useState(true);
  const [hasHistoryData, setHasHistoryData] = useState(true);
  const [hasClustersData, setHasClustersData] = useState(true);

  // 스크롤 핸들러 (메인 화면 방식)
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const scrollLeft = container.scrollLeft;
    const slideWidth = container.offsetWidth;
    const newSlide = Math.round(scrollLeft / slideWidth);
    setCurrentSlide(newSlide);
  };

  const scrollToSlide = (index: number) => {
    const container = document.getElementById('issue-carousel-container');
    if (container) {
      const slideWidth = container.offsetWidth;
      container.scrollTo({
        left: slideWidth * index,
        behavior: 'smooth',
      });
    }
  };

  // Mock 데이터 제거 - 실제 API 데이터만 사용

  const getIndexColor = (index: number) => {
    if (index >= 75) return 'text-red-600';
    if (index >= 50) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getIndexLabel = (index: number) => {
    if (index >= 75) return '위험';
    if (index >= 50) return '주의';
    return '안정';
  };

  const getTrendIcon = (trend: string) => {
    if (trend === 'up') return <ArrowUp className="h-5 w-5" />;
    if (trend === 'down') return <ArrowDown className="h-5 w-5" />;
    return <Minus className="h-5 w-5" />;
  };

  // ==================== API 호출 함수 ====================

  // 현재 이슈 지수 조회
  const fetchCurrentIndex = async () => {
    setIsLoadingCurrent(true);
    setCurrentError(null);
    try {
      const response = await IssueAPI.getCurrentIssueIndex();
      
      if (response.success && response.data && response.data.collected_at) {
        setCurrentIndex(response.data);
        setHasCurrentData(true);
        // 현재 지수 로드 후 클러스터도 자동 로드
        fetchClusters(response.data.collected_at);
      } else {
        setHasCurrentData(false);
        setCurrentIndex(null);
      }
    } catch (err: any) {
      console.error('Failed to fetch current index:', err);
      setCurrentError('현재 이슈 지수를 불러오는데 실패했습니다.');
      setHasCurrentData(false);
    } finally {
      setIsLoadingCurrent(false);
    }
  };

  // 히스토리 데이터 조회 (범위 조회 API 사용)
  const fetchHistoryData = async (range: '7d' | '30d') => {
    setIsLoadingHistory(true);
    setHistoryError(null);
    try {
      const days = range === '7d' ? 7 : 30;
      const result = await IssueAPI.getRecentIssueIndices(days);
      
      setHistoryData(result.data);
      setHistoryMetadata(result.metadata || null);
      setHasHistoryData(result.hasData);
      
      if (!result.hasData && result.metadata?.missing_dates) {
        console.log('[IssuePage] No history data. Missing dates:', result.metadata.missing_dates);
      }
    } catch (err: any) {
      console.error('Failed to fetch history:', err);
      setHistoryError('히스토리 데이터를 불러오는데 실패했습니다.');
      setHasHistoryData(false);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 직업별 지수 조회
  const fetchAllJobIndices = async () => {
    setIsLoadingJobs(true);
    try {
      const response = await IssueAPI.getAllJobIndices();
      setAllJobIndices(response.jobs || []);
    } catch (err: any) {
      console.error('Failed to fetch job indices:', err);
    } finally {
      setIsLoadingJobs(false);
    }
  };

  // 클러스터 조회 (에러 처리 강화)
  const fetchClusters = async (collectedAt: string) => {
    setIsLoadingClusters(true);
    setClustersError(null);
    try {
      const response = await IssueAPI.getClusterSnapshot(collectedAt);
      
      setClusters(response.data || []);
      setClusterMetadata(response.metadata || null);
      setHasClustersData(response.data && response.data.length > 0);
      
      if (!response.success) {
        setClustersError(response.metadata?.message || '클러스터를 불러오는데 실패했습니다.');
      }
    } catch (err: any) {
      console.error('Failed to fetch clusters:', err);
      setClustersError('클러스터를 불러오는데 실패했습니다.');
      setHasClustersData(false);
    } finally {
      setIsLoadingClusters(false);
    }
  };

  // 데이터 새로고침
  const handleRefresh = () => {
    fetchCurrentIndex();
    fetchHistoryData(trendPeriod);
  };

  // ==================== useEffect Hooks ====================

  // 컴포넌트 마운트 시 현재 지수와 히스토리 로드
  useEffect(() => {
    fetchCurrentIndex();
    fetchHistoryData('7d');
  }, []);

  // 시간 범위 변경 시 히스토리 재로드
  useEffect(() => {
    fetchHistoryData(trendPeriod);
  }, [trendPeriod]);

  // 직업별 지수 탭 선택 시 로드
  useEffect(() => {
    if (selectedTab === 'byjob' && allJobIndices.length === 0) {
      fetchAllJobIndices();
    }
  }, [selectedTab]);

  // ==================== Computed Values ====================

  // 안전한 숫자 변환 헬퍼
  const toSafeNumber = (value: unknown, defaultValue: number = 0): number => {
    if (value === null || value === undefined) return defaultValue;
    const num = Number(value);
    return isNaN(num) ? defaultValue : num;
  };

  // 차트 데이터 변환 (숫자 타입 보장)
  const chartData = useMemo(() => {
    if (historyData.length === 0) return [];
    return historyData.map((item) => ({
      date: IssueHelpers.formatShortDate(item.collected_at),
      index: toSafeNumber(item.overall_index),
      clusters: toSafeNumber(item.active_clusters_count),
    }));
  }, [historyData]);

  // 24시간 데이터 (최근 데이터에서 필터링, 숫자 타입 보장)
  const hourlyChartData = useMemo(() => {
    const last24Hours = IssueHelpers.filter24HoursData(historyData);
    return last24Hours.map((item) => ({
      hour: IssueHelpers.formatTime(item.collected_at),
      index: toSafeNumber(item.overall_index),
    }));
  }, [historyData]);

  // 실제 데이터 사용 (더 이상 Mock 데이터 사용 안함)
  const integratedIndex = toSafeNumber(currentIndex?.overall_index, 0);
  const previousDayIndex = historyData.length > 1 
    ? toSafeNumber(historyData[historyData.length - 2]?.overall_index, integratedIndex) 
    : integratedIndex;
  const indexChange = integratedIndex - previousDayIndex;
  const activeClusters = toSafeNumber(currentIndex?.active_clusters_count, 0);
  const totalArticles = toSafeNumber(currentIndex?.total_articles_analyzed, 0);

  // 차트에 사용할 데이터 (실제 데이터만 사용)
  const trendData = chartData;
  const hourlyDisplayData = hourlyChartData;

  // 직업별 지수 (실제 데이터만 사용)
  const jobDisplayData = allJobIndices.map((job) => ({
    job: job.job_category,
    index: job.issue_index,
    trend: 'stable' as const,
    change: 0,
  }));

  // 뉴스 클러스터 (실제 데이터만 사용)
  const newsDisplayData = clusters.map((cluster) => ({
    title: cluster.topic_name,
    tags: cluster.tags,
    score: cluster.cluster_score,
    articles: cluster.article_count,
    createdAt: IssueHelpers.formatDate(cluster.appearance_count.toString()),
    updatedAt: IssueHelpers.formatDate(cluster.appearance_count.toString()),
    cluster_id: cluster.cluster_id,
    collected_at: currentIndex?.collected_at,
    article_indices: cluster.article_indices,
  }));

  // 데이터 없음 표시 컴포넌트
  const NoDataMessage = ({ 
    message, 
    subMessage,
    onRetry 
  }: { 
    message: string; 
    subMessage?: string;
    onRetry?: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
      <p className="text-gray-600 font-medium">{message}</p>
      {subMessage && (
        <p className="text-sm text-gray-400 mt-1">{subMessage}</p>
      )}
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </button>
      )}
    </div>
  );

  // 에러 표시 컴포넌트
  const ErrorMessage = ({ 
    message, 
    onRetry 
  }: { 
    message: string; 
    onRetry?: () => void;
  }) => (
    <div className="flex flex-col items-center justify-center py-8 text-center bg-red-50 rounded-lg">
      <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
      <p className="text-red-600 font-medium">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          다시 시도
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <AppHeader 
        userData={userData} 
        onNavigate={onNavigate}
        title="AI 이슈 지수"
        subtitle="AI 업계의 실시간 이슈를 확인하세요"
      />
      <div className="max-w-6xl mx-auto space-y-4 p-4">
        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2 bg-white border-0">
            <TabsTrigger value="integrated">통합 대시보드</TabsTrigger>
            <TabsTrigger value="byjob">직업별 지수</TabsTrigger>
          </TabsList>

          <TabsContent value="integrated" className="space-y-4">
            {/* 네이티브 스크롤 캐러셀 */}
            <div className="bg-white rounded-xl p-4 pb-12 relative">
              {/* 로딩 상태 */}
              {isLoadingCurrent && (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                  <span className="ml-2 text-gray-600">데이터 로딩 중...</span>
                </div>
              )}

              {/* 에러 상태 */}
              {!isLoadingCurrent && currentError && (
                <ErrorMessage message={currentError} onRetry={handleRefresh} />
              )}

              {/* 데이터 없음 상태 */}
              {!isLoadingCurrent && !currentError && !hasCurrentData && (
                <NoDataMessage 
                  message="현재 이슈 지수 데이터가 없습니다"
                  subMessage="아직 수집된 데이터가 없거나 서버와의 연결이 원활하지 않습니다."
                  onRetry={handleRefresh}
                />
              )}

              {/* 데이터 있을 때 */}
              {!isLoadingCurrent && !currentError && hasCurrentData && (
              <>
              <div 
                id="issue-carousel-container"
                className="overflow-x-auto overflow-y-hidden snap-x snap-mandatory scrollbar-hide"
                onScroll={handleScroll}
                style={{
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                }}
              >
                <div className="flex">
                  {/* 슬라이드 1: 현재 지수 & 게이지 */}
                  <div className="flex-shrink-0 w-full snap-center px-2">
                    <div className="space-y-4">
                      <h2 className="text-lg text-center mb-4">현재 이슈 지수</h2>
                      
                      {/* 통계 카드 */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-lg bg-gray-50">
                          <Activity className="h-4 w-4 text-indigo-600 mx-auto mb-1" />
                          <div className={`text-2xl ${getIndexColor(integratedIndex)}`}>
                            {integratedIndex.toFixed(1)}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">현재 지수</div>
                        </div>
                        
                        <div className="text-center p-3 rounded-lg bg-gray-50">
                          <BarChart3 className="h-4 w-4 text-indigo-600 mx-auto mb-1" />
                          <div className="text-2xl">{activeClusters}</div>
                          <div className="text-xs text-muted-foreground mt-1">활성 클러스터</div>
                        </div>
                        
                        <div className="text-center p-3 rounded-lg bg-gray-50">
                          <Newspaper className="h-4 w-4 text-indigo-600 mx-auto mb-1" />
                          <div className="text-2xl">{totalArticles >= 1000 ? `${(totalArticles / 1000).toFixed(1)}k` : totalArticles}</div>
                          <div className="text-xs text-muted-foreground mt-1">분석 기사</div>
                        </div>
                      </div>

                      {/* 게이지 */}
                      <div className="mt-4 space-y-3">
                        {/* 프로그레스 바 */}
                        <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                          <motion.div
                            className={`h-4 rounded-full ${
                              integratedIndex >= 75 ? 'bg-red-500' : 
                              integratedIndex >= 50 ? 'bg-yellow-500' : 
                              'bg-green-500'
                            }`}
                            initial={{ width: "0%" }}
                            animate={{ width: `${integratedIndex}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                          />
                        </div>
                        
                        {/* 0과 100 표시 */}
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>0</span>
                          <span>100</span>
                        </div>
                        
                        {/* 숫자 표시 */}
                        <div className="text-center">
                          <motion.div 
                            className={`text-5xl ${getIndexColor(integratedIndex)}`}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                          >
                            {integratedIndex.toFixed(1)}
                          </motion.div>
                          <div className="text-sm text-muted-foreground mt-1" style={{ fontWeight: '700' }}>
                            {getIndexLabel(integratedIndex)} 단계
                          </div>
                        </div>
                        
                        {/* 전일 대비 변화 */}
                        {historyData.length > 1 && (
                        <div className={`flex items-center justify-center gap-1 text-sm ${indexChange >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          {indexChange >= 0 ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                          <span>전일 대비 {Math.abs(indexChange).toFixed(1)}점</span>
                        </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 슬라이드 2: 추이 분석 */}
                  <div className="flex-shrink-0 w-full snap-center px-2">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg">지수 추이 분석</h2>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setTrendPeriod('7d')}
                            className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                              trendPeriod === '7d' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            7일
                          </button>
                          <button
                            onClick={() => setTrendPeriod('30d')}
                            className={`px-3 py-1 rounded-lg text-xs transition-colors ${
                              trendPeriod === '30d' 
                                ? 'bg-indigo-600 text-white' 
                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                          >
                            30일
                          </button>
                        </div>
                      </div>

                      {/* 히스토리 로딩 상태 */}
                      {isLoadingHistory && (
                        <div className="flex items-center justify-center h-[280px]">
                          <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
                        </div>
                      )}

                      {/* 히스토리 데이터 없음 */}
                      {!isLoadingHistory && trendData.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[280px] text-center">
                          <AlertCircle className="h-10 w-10 text-gray-300 mb-2" />
                          <p className="text-gray-500 text-sm">
                            {historyMetadata?.missing_dates && historyMetadata.missing_dates.length > 0
                              ? `선택한 기간에 데이터가 없습니다`
                              : '히스토리 데이터가 없습니다'}
                          </p>
                          {historyMetadata?.actual_count !== undefined && (
                            <p className="text-gray-400 text-xs mt-1">
                              조회된 데이터: {historyMetadata.actual_count}건
                            </p>
                          )}
                        </div>
                      )}

                      {/* 차트 표시 */}
                      {!isLoadingHistory && trendData.length > 0 && (
                        <>
                          <ResponsiveContainer width="100%" height={280}>
                            <AreaChart
                              data={trendData}
                              margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
                            >
                              <defs>
                                <linearGradient id="colorIndex" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#818cf8" stopOpacity={0.3}/>
                                  <stop offset="95%" stopColor="#818cf8" stopOpacity={0}/>
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 11 }}
                                stroke="#999"
                              />
                              <YAxis 
                                domain={[0, 100]} 
                                tick={{ fontSize: 11 }}
                                stroke="#999"
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  fontSize: '12px'
                                }} 
                              />
                              <Area 
                                type="monotone" 
                                dataKey="index" 
                                stroke="#818cf8" 
                                strokeWidth={2}
                                fill="url(#colorIndex)" 
                              />
                            </AreaChart>
                          </ResponsiveContainer>

                          <div className="grid grid-cols-3 gap-2 text-sm">
                            <div className="p-3 rounded-lg bg-gray-50 text-center">
                              <div className="text-muted-foreground text-xs mb-1">최저</div>
                              <div className="text-green-600">
                                {Math.min(...trendData.map(d => d.index)).toFixed(1)}
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50 text-center">
                              <div className="text-muted-foreground text-xs mb-1">평균</div>
                              <div className="text-gray-700">
                                {(trendData.reduce((total, d) => total + d.index, 0) / trendData.length).toFixed(1)}
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50 text-center">
                              <div className="text-muted-foreground text-xs mb-1">최고</div>
                              <div className="text-red-600">
                                {Math.max(...trendData.map(d => d.index)).toFixed(1)}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* 슬라이드 3: 24시간 변화 */}
                  <div className="flex-shrink-0 w-full snap-center px-2">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Clock className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-lg">24시간 지수 변화</h2>
                      </div>

                      {/* 24시간 데이터 없음 */}
                      {hourlyDisplayData.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-[280px] text-center">
                          <AlertCircle className="h-10 w-10 text-gray-300 mb-2" />
                          <p className="text-gray-500 text-sm">24시간 데이터가 없습니다</p>
                          <p className="text-gray-400 text-xs mt-1">
                            데이터 수집 후 표시됩니다
                          </p>
                        </div>
                      )}

                      {/* 차트 표시 */}
                      {hourlyDisplayData.length > 0 && (
                        <>
                          <ResponsiveContainer width="100%" height={280}>
                            <BarChart
                              data={hourlyDisplayData}
                              margin={{ top: 5, right: 5, left: -30, bottom: 5 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                              <XAxis 
                                dataKey="hour" 
                                tick={{ fontSize: 10 }}
                                stroke="#999"
                              />
                              <YAxis 
                                domain={[0, 100]} 
                                tick={{ fontSize: 10 }}
                                stroke="#999"
                              />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: 'white', 
                                  border: '1px solid #e5e7eb',
                                  borderRadius: '8px',
                                  fontSize: '12px'
                                }} 
                              />
                              <Bar 
                                dataKey="index" 
                                fill="#818cf8" 
                                radius={[4, 4, 0, 0]}
                              />
                            </BarChart>
                          </ResponsiveContainer>

                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="p-3 rounded-lg bg-gray-50">
                              <div className="text-muted-foreground text-xs mb-1">가장 높았던 시간</div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-red-600" />
                                {(() => {
                                  const maxItem = hourlyDisplayData.reduce((max, item) => 
                                    item.index > max.index ? item : max, hourlyDisplayData[0]);
                                  return (
                                    <>
                                      <span>{maxItem.hour}</span>
                                      <span className="text-red-600">{maxItem.index.toFixed(1)}</span>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                            <div className="p-3 rounded-lg bg-gray-50">
                              <div className="text-muted-foreground text-xs mb-1">가장 낮았던 시간</div>
                              <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-600 rotate-180" />
                                {(() => {
                                  const minItem = hourlyDisplayData.reduce((min, item) => 
                                    item.index < min.index ? item : min, hourlyDisplayData[0]);
                                  return (
                                    <>
                                      <span>{minItem.hour}</span>
                                      <span className="text-green-600">{minItem.index.toFixed(1)}</span>
                                    </>
                                  );
                                })()}
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 인디케이터 */}
              <div className="flex items-center justify-center gap-2 mt-6">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSlide(index)}
                    className={`h-2 rounded-full transition-all ${
                      currentSlide === index 
                        ? 'bg-indigo-600 w-6' 
                        : 'bg-gray-300 w-2 hover:bg-indigo-400'
                    }`}
                    aria-label={`슬라이드 ${index + 1}로 이동`}
                  />
                ))}
              </div>
              </>
              )}
            </div>

            {/* 스와이프 힌트 */}
            <div className="text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
              <ChevronLeft className="h-4 w-4" />
              <span>좌우로 스와이프하여 더 많은 정보 확인</span>
              <ChevronRight className="h-4 w-4" />
            </div>

            {/* scrollbar-hide 스타일 */}
            <style>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          </TabsContent>

          <TabsContent value="byjob" className="space-y-4">
            {/* 직업별 지수 - 간소화 */}
            <div className="bg-white rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Briefcase className="h-5 w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">직업별 AI 이슈 지수</h2>
              </div>
              
              {isLoadingJobs ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : jobDisplayData.length === 0 ? (
                <NoDataMessage 
                  message="직업별 지수 데이터가 없습니다"
                  subMessage="아직 수집된 직업별 데이터가 없습니다."
                  onRetry={fetchAllJobIndices}
                />
              ) : (
                <div className="space-y-3">
                  {jobDisplayData.map((item) => (
                    <div
                      key={item.job}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span>{item.job}</span>
                        <span className={`text-xs ${item.change >= 0 ? 'text-red-600' : 'text-green-600'}`}>
                          ({item.change >= 0 ? '+' : ''}{item.change}%)
                        </span>
                      </div>
                      {/* 미니 프로그레스 바 */}
                      <div className="mt-2 w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all ${
                            item.index >= 75 ? 'bg-red-500' : 
                            item.index >= 50 ? 'bg-yellow-500' : 
                            'bg-green-500'
                          }`}
                          style={{ width: `${item.index}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      {getTrendIcon(item.trend)}
                      <div className={`text-2xl ${getIndexColor(item.index)}`}>
                        {item.index}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {/* News Clusters - 간소화 (상위 3개만 표시) */}
        <div className="bg-white rounded-xl p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-indigo-600" />
              <h2 className="text-base sm:text-lg">주요 이슈 뉴스</h2>
            </div>
            {newsDisplayData.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {showAllClusters ? `전체 ${newsDisplayData.length}` : `TOP ${Math.min(3, newsDisplayData.length)}`}
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mb-4">가장 영향력 있는 뉴스 클러스터</p>

          {/* 로딩 상태 */}
          {isLoadingClusters ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : clustersError ? (
            /* 에러 상태 */
            <ErrorMessage message={clustersError} onRetry={() => currentIndex?.collected_at && fetchClusters(currentIndex.collected_at)} />
          ) : !hasClustersData || newsDisplayData.length === 0 ? (
            /* 데이터 없음 상태 */
            <NoDataMessage 
              message="뉴스 클러스터 데이터가 없습니다"
              subMessage={clusterMetadata?.message || "현재 분석된 클러스터가 없습니다."}
              onRetry={() => currentIndex?.collected_at && fetchClusters(currentIndex.collected_at)}
            />
          ) : (
            <>
              <div className="space-y-3">
                {(showAllClusters ? newsDisplayData : newsDisplayData.slice(0, 3)).map((cluster, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-white hover:from-indigo-50 hover:to-purple-50 border border-transparent hover:border-indigo-200 transition-all cursor-pointer group"
                onClick={() => onSelectCluster(cluster)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-start gap-2 flex-1">
                    <div className={`flex items-center justify-center w-6 h-6 rounded-full shrink-0 text-xs ${
                      index === 0 ? 'bg-yellow-400 text-white' :
                      index === 1 ? 'bg-gray-400 text-white' :
                      index === 2 ? 'bg-orange-400 text-white' :
                      'bg-blue-400 text-white'
                    }`}>
                      {index + 1}
                    </div>
                    <h3 className="flex-1 pr-4 group-hover:text-indigo-600 transition-colors text-sm">
                      {cluster.title}
                    </h3>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`shrink-0 text-xs ${cluster.score >= 85 ? 'border-red-300 bg-red-50 text-red-700' : 'border-yellow-300 bg-yellow-50 text-yellow-700'}`}
                  >
                    {cluster.score}점
                  </Badge>
                </div>
                
                <div className="flex flex-wrap gap-1.5 mb-2 ml-8">
                  {cluster.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {cluster.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{cluster.tags.length - 3}
                    </Badge>
                  )}
                </div>
                
                <div className="flex items-center gap-3 text-xs text-muted-foreground ml-8">
                  <span className="flex items-center gap-1">
                    <Newspaper className="h-3 w-3" />
                    {cluster.articles}개
                  </span>
                  <span>{cluster.updatedAt}</span>
                </div>
              </div>
                ))}
              </div>

              {newsDisplayData.length > 3 && (
                <button
                  onClick={() => setShowAllClusters(!showAllClusters)}
                  className="w-full mt-3 py-2 text-sm text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  {showAllClusters ? '접기' : `전체 ${newsDisplayData.length}개 클러스터 보기`}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}