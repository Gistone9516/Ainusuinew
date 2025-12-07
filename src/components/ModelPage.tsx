import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Search, BarChart3, TrendingUp, TrendingDown, Clock, GitBranch, Zap, ArrowLeft, Loader2, Award } from 'lucide-react';
import type { UserData, Page } from '../App';
import { AppHeader } from './AppHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'motion/react';
import * as modelApi from '../lib/api/models';
import * as modelHelpers from '../lib/utils/modelHelpers';
import type * as T from '../types/model';

interface ModelPageProps {
  userData: UserData;
  onNavigate: (page: Page) => void;
}

export function ModelPage({ userData, onNavigate }: ModelPageProps) {
  const [taskInput, setTaskInput] = useState('');
  const [modelA, setModelA] = useState<string>('');
  const [modelB, setModelB] = useState<string>('');

  // Task recommendation states
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<T.ClassifyAndRecommendResponse | null>(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Model comparison states
  const [availableModels, setAvailableModels] = useState<T.Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [comparisonResult, setComparisonResult] = useState<T.ModelComparison | null>(null);
  const [isComparing, setIsComparing] = useState(false);
  const [comparisonError, setComparisonError] = useState<string | null>(null);

  // Timeline tab states
  const [selectedSeries, setSelectedSeries] = useState<string>('GPT');
  const [comparisonSeries, setComparisonSeries] = useState<string[]>(['GPT', 'Claude']);
  const [selectedBenchmark] = useState<string>('MMLU_PRO');
  const [showAllTimeline, setShowAllTimeline] = useState<boolean>(false);
  const [availableSeriesList, setAvailableSeriesList] = useState<T.SeriesInfo[]>([]);
  const [timelineData, setTimelineData] = useState<Record<string, T.TimelineEvent[]>>({});
  const [benchmarkProgressionData, setBenchmarkProgressionData] = useState<Record<string, any[]>>({});

  // Job-based recommendation states
  const [jobRecommendedModels, setJobRecommendedModels] = useState<T.JobRecommendation[]>([]);
  const [jobCategory, setJobCategory] = useState<string>('당신');
  const [jobCriteria, setJobCriteria] = useState<{
    primary_benchmark: string;
    secondary_benchmark: string;
  } | null>(null);
  const [isLoadingJobRecommendations, setIsLoadingJobRecommendations] = useState(false);

  // Load initial data
  useEffect(() => {
    loadModelsAndSeries();
    loadJobBasedRecommendations();
  }, []);

  // Load models for comparison
  const loadModelsAndSeries = async () => {
    setIsLoadingModels(true);
    try {
      // Load models
      const modelsResponse = await modelApi.getModels({ page: 1, limit: 100 });
      if (modelsResponse.success && modelsResponse.data) {
        setAvailableModels(modelsResponse.data.items);
      }

      // Load available series
      const seriesResponse = await modelApi.getAvailableSeries();
      if (seriesResponse.success && seriesResponse.data) {
        setAvailableSeriesList(seriesResponse.data);
      }
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // Load job-based model recommendations
  const loadJobBasedRecommendations = async () => {
    setIsLoadingJobRecommendations(true);
    try {
      // 사용자 직업 정보가 있으면 해당 직업 기반 추천
      const jobCode = userData.job_category_code;
      const jobId = userData.job_category_id;

      // job_category_code 또는 job_category_id가 없으면 API 호출 건너뜀 (빈 배열 유지)
      if (!jobCode && !jobId) {
        console.log('[ModelPage] No job category info, skipping API call');
        setIsLoadingJobRecommendations(false);
        return;
      }

      const response = await modelApi.getModelsByJobCategory({
        job_category_code: jobCode,
        job_category_id: jobId,
        limit: 3,
      });

      if (response.success && response.data) {
        // 직업 카테고리 정보 저장
        setJobCategory(response.data.job_category.job_name);

        // 벤치마크 기준 저장
        setJobCriteria({
          primary_benchmark: response.data.criteria.primary_benchmark,
          secondary_benchmark: response.data.criteria.secondary_benchmark,
        });

        // 추천 모델 저장 (API 응답 그대로 사용)
        setJobRecommendedModels(response.data.recommended_models);

        console.log('[ModelPage] Job-based recommendations loaded:', {
          category: response.data.job_category.job_name,
          count: response.data.recommended_models.length,
          models: response.data.recommended_models.map(m => m.model_name),
        });
      }
    } catch (error) {
      console.error('[ModelPage] Error loading job-based recommendations:', error);
      // 에러 발생 시 빈 배열 유지
    } finally {
      setIsLoadingJobRecommendations(false);
    }
  };

  // Load timeline data for a specific series
  const loadTimelineData = async (series: string) => {
    try {
      const response = await modelApi.getSeriesTimeline(series, 20);
      if (response.success && response.data) {
        setTimelineData(prev => ({
          ...prev,
          [series]: response.data.timeline
        }));
      }
    } catch (error) {
      console.error(`Error loading timeline for ${series}:`, error);
    }
  };

  // Load benchmark progression data
  const loadBenchmarkProgression = async (series: string, benchmark: string) => {
    try {
      const response = await modelApi.getBenchmarkProgression(series, benchmark);
      if (response.success && response.data) {
        setBenchmarkProgressionData(prev => ({
          ...prev,
          [series]: response.data.progression
        }));
      }
    } catch (error) {
      console.error(`Error loading benchmark progression:`, error);
    }
  };

  const getSeriesTimeline = (series: string): T.TimelineEvent[] => {
    const timeline = timelineData[series];
    if (!timeline || !Array.isArray(timeline)) return [];
    return timeline;
  };

  const getComparisonTimeline = () => {
    const allEvents: Array<T.TimelineEvent & { series: string }> = [];
    if (!comparisonSeries || !Array.isArray(comparisonSeries)) return allEvents;
    comparisonSeries.forEach(series => {
      const timeline = getSeriesTimeline(series);
      timeline.forEach(model => {
        if (model) {
          allEvents.push({
            ...model,
            series,
          });
        }
      });
    });
    return allEvents.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
  };

  const getBenchmarkData = () => {
    const data = benchmarkProgressionData[selectedSeries];
    if (!data || !Array.isArray(data)) return [];
    // 과거 -> 최신 순서로 정렬 (왼쪽에서 오른쪽으로 시간이 흐르도록)
    return [...data].reverse();
  };

  // Y축 도메인 계산 함수 - Requirements 2.1, 2.2, 2.4
  const calculateYAxisDomain = (data: any[]): [number, number] => {
    // 빈 배열일 때 기본값 [0, 1] 반환 (Requirement 2.4)
    if (!data || data.length === 0) {
      return [0, 1];
    }
    
    const scores = data.map(d => d.score).filter(s => typeof s === 'number');
    if (scores.length === 0) {
      return [0, 1];
    }
    
    // 데이터의 min/max 값 계산 (Requirement 2.1)
    const min = Math.min(...scores);
    const max = Math.max(...scores);
    const range = max - min;
    
    // 10% 패딩 적용 (Requirement 2.2)
    const padding = range * 0.1;
    
    // 최소값이 0보다 작아지지 않도록 처리
    const domainMin = Math.max(0, min - padding);
    const domainMax = max + padding;
    
    return [domainMin, domainMax];
  };

  // Get model data from comparison result
  const getModelData = (modelId: string): T.ComparisonModel | null => {
    if (!comparisonResult) return null;
    if (comparisonResult.model_a.model_id === modelId) {
      return comparisonResult.model_a;
    }
    if (comparisonResult.model_b.model_id === modelId) {
      return comparisonResult.model_b;
    }
    return null;
  };


  const toggleComparisonSeries = async (series: string) => {
    if (comparisonSeries.includes(series)) {
      if (comparisonSeries.length > 1) {
        setComparisonSeries(comparisonSeries.filter(s => s !== series));
      }
    } else {
      if (comparisonSeries.length < 5) {
        setComparisonSeries([...comparisonSeries, series]);
        // Load timeline data if not already loaded
        if (!timelineData[series]) {
          await loadTimelineData(series);
        }
      }
    }
  };

  // Handle model comparison
  const handleCompareModels = async () => {
    if (!modelA || !modelB) return;

    setIsComparing(true);
    setComparisonError(null);
    try {
      const response = await modelApi.compareModels(modelA, modelB);
      if (response.success && response.data) {
        setComparisonResult(response.data);
      } else {
        setComparisonError('모델 비교에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error comparing models:', error);
      setComparisonError(modelHelpers.extractErrorMessage(error));
    } finally {
      setIsComparing(false);
    }
  };

  // Compare models when both are selected
  useEffect(() => {
    if (modelA && modelB && modelA !== modelB) {
      handleCompareModels();
    } else {
      setComparisonResult(null);
    }
  }, [modelA, modelB]);

  // Get comparison chart data from key_benchmarks
  const getComparisonData = () => {
    if (!comparisonResult) {
      console.log('[ModelPage] No comparisonResult found');
      return [];
    }

    const modelA = comparisonResult.model_a;
    const modelB = comparisonResult.model_b;

    if (!modelA.key_benchmarks || !modelB.key_benchmarks) {
      console.log('[ModelPage] No key_benchmarks found');
      return [];
    }

    // 두 모델의 key_benchmarks를 병합하여 비교 데이터 생성
    const benchmarkMap = new Map<string, { name: string; display_name: string; scoreA: number; scoreB: number }>();

    // Model A의 벤치마크 추가
    modelA.key_benchmarks.forEach(benchmark => {
      benchmarkMap.set(benchmark.name, {
        name: benchmark.name,
        display_name: benchmark.display_name,
        scoreA: parseFloat(benchmark.normalized_score) || 0,
        scoreB: 0,
      });
    });

    // Model B의 벤치마크 추가 또는 업데이트
    modelB.key_benchmarks.forEach(benchmark => {
      const existing = benchmarkMap.get(benchmark.name);
      if (existing) {
        existing.scoreB = parseFloat(benchmark.normalized_score) || 0;
      } else {
        benchmarkMap.set(benchmark.name, {
          name: benchmark.name,
          display_name: benchmark.display_name,
          scoreA: 0,
          scoreB: parseFloat(benchmark.normalized_score) || 0,
        });
      }
    });

    // Map을 배열로 변환하고 점수 합계 기준으로 정렬
    return Array.from(benchmarkMap.values())
      .sort((a, b) => (b.scoreA + b.scoreB) - (a.scoreA + a.scoreB))
      .map(item => ({
        name: item.display_name,
        scoreA: item.scoreA,
        scoreB: item.scoreB,
      }));
  };

  // Load timeline on series change
  useEffect(() => {
    if (selectedSeries && !benchmarkProgressionData[selectedSeries]) {
      loadBenchmarkProgression(selectedSeries, selectedBenchmark);
    }
  }, [selectedSeries, selectedBenchmark]);

  // Load timeline data for comparison series
  useEffect(() => {
    comparisonSeries.forEach(series => {
      if (!timelineData[series]) {
        loadTimelineData(series);
      }
    });
  }, [comparisonSeries]);

  // Handle task search with real API
  const handleTaskSearch = async () => {
    if (!taskInput.trim()) return;

    setIsSearching(true);
    setSearchError(null);
    try {
      const response = await modelApi.classifyAndRecommend(taskInput, 5);
      if (response.success && response.data) {
        setSearchResult(response.data);
        setShowSearchResult(true);
      } else {
        setSearchError('모델 추천에 실패했습니다.');
      }
    } catch (error) {
      console.error('Error searching tasks:', error);
      setSearchError(modelHelpers.extractErrorMessage(error));
    } finally {
      setIsSearching(false);
    }
  };

  // Handle back to search
  const handleBackToSearch = () => {
    setShowSearchResult(false);
    setSearchResult(null);
  };

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <AppHeader 
        userData={userData} 
        onNavigate={onNavigate}
        title="모델 추천 & 비교"
        subtitle="당신에게 맞는 AI 모델을 찾아보세요"
      />
      
      {/* Loading Overlay */}
      {isSearching && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 sm:p-8 max-w-sm w-full text-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg mb-2">AI 모델 분석 중...</h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              작업에 최적화된 모델을 찾고 있습니다
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {searchError && !isSearching && (
        <div className="max-w-4xl mx-auto p-3 sm:p-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-800">{searchError}</p>
          </div>
        </div>
      )}

      {/* Search Result Overlay */}
      {showSearchResult && searchResult && (
        <div className="fixed inset-0 bg-gray-50 z-40 overflow-y-auto pb-20">
          <div className="max-w-4xl mx-auto space-y-3 p-3 sm:p-4 sm:space-y-4">
            {/* Back Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleBackToSearch}
              className="text-sm"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              검색으로 돌아가기
            </Button>

            {/* Editable Search Query - 수정 가능하도록 변경 */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">작업 내용</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                작업 내용을 수정하고 다시 검색할 수 있습니다
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="작업 내용 입력"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleTaskSearch();
                    }
                  }}
                  className="text-sm border-gray-200"
                />
                <Button 
                  className="shrink-0 text-sm" 
                  onClick={handleTaskSearch}
                  disabled={!taskInput.trim()}
                >
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">재검색</span>
                </Button>
              </div>
            </div>

            {/* Classification Result */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">작업 분류 결과</h2>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground mb-1">카테고리</p>
                    <p className="text-sm sm:text-base">{searchResult.classification.category_name_ko}</p>
                    <p className="text-xs text-muted-foreground">{searchResult.classification.category_name_en}</p>
                  </div>
                  <Badge variant="default" className="text-xs">
                    신뢰도 {(searchResult.classification.confidence_score * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">분석 결과</p>
                  <p className="text-xs sm:text-sm">{searchResult.classification.reasoning}</p>
                </div>
              </div>
            </div>

            {/* Evaluation Criteria */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">평가 기준</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3">
                이 작업에 최적화된 벤치마크 기준
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">주요 벤치마크</p>
                  <p className="text-sm sm:text-base">{searchResult.criteria.primary_benchmark}</p>
                  <Badge variant="default" className="text-xs mt-2">
                    가중치 {(searchResult.criteria.weights.primary * 100).toFixed(0)}%
                  </Badge>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">보조 벤치마크</p>
                  <p className="text-sm sm:text-base">{searchResult.criteria.secondary_benchmark}</p>
                  <Badge variant="secondary" className="text-xs mt-2">
                    가중치 {(searchResult.criteria.weights.secondary * 100).toFixed(0)}%
                  </Badge>
                </div>
              </div>
            </div>

            {/* Recommended Models */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">추천 AI 모델</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                이 작업에 최적화된 상위 {searchResult.recommended_models.length}개 모델
              </p>
              
              <div className="space-y-3">
                {(searchResult.recommended_models || []).map((model, index) => (
                  <motion.div
                    key={model.model_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-3 sm:p-4 rounded-xl bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-100"
                  >
                    {/* Model Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full shrink-0 ${
                          index === 0 ? 'bg-yellow-400 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          'bg-orange-400 text-white'
                        }`}>
                          <span className="text-sm sm:text-base">{index + 1}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base truncate">{model.model_name}</h3>
                          <p className="text-xs text-muted-foreground">{model.creator_name}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="shrink-0 ml-2 text-xs">
                        {Number(model.weighted_score || 0).toFixed(1)}점
                      </Badge>
                    </div>

                    {/* Benchmark Scores */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 bg-white/70 rounded-lg">
                        <p className="text-[10px] text-muted-foreground mb-0.5">{model.benchmark_scores.primary.name}</p>
                        <p className="text-xs sm:text-sm">{model.benchmark_scores.primary.score} 점</p>
                        <p className="text-[10px] text-green-600">기여도: {Number(model.benchmark_scores.primary.contribution || 0).toFixed(1)}</p>
                      </div>
                      <div className="p-2 bg-white/70 rounded-lg">
                        <p className="text-[10px] text-muted-foreground mb-0.5">{model.benchmark_scores.secondary.name}</p>
                        <p className="text-xs sm:text-sm">{model.benchmark_scores.secondary.score} 점</p>
                        <p className="text-[10px] text-green-600">기여도: {Number(model.benchmark_scores.secondary.contribution || 0).toFixed(1)}</p>
                      </div>
                    </div>

                    {/* Pricing & Overall Score */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="outline" className="text-xs bg-white">
                          종합: {model.overall_score}점
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-white">
                          입력: ${model.pricing.input_price}
                        </Badge>
                        <Badge variant="outline" className="text-xs bg-white">
                          출력: ${model.pricing.output_price}
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <h3 className="text-sm mb-3 text-muted-foreground">분석 정보</h3>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-muted-foreground mb-1">평가 모델</p>
                  <p className="text-xs sm:text-sm">{searchResult.metadata.total_models_evaluated}개</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-muted-foreground mb-1">분류 시간</p>
                  <p className="text-xs sm:text-sm">{searchResult.metadata.classification_time_ms}ms</p>
                </div>
                <div className="p-2 bg-gray-50 rounded-lg">
                  <p className="text-[10px] text-muted-foreground mb-1">추천 시간</p>
                  <p className="text-xs sm:text-sm">{searchResult.metadata.recommendation_time_ms}ms</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-3 p-3 sm:p-4 sm:space-y-4">
        <Tabs defaultValue="recommend">
          <TabsList className="grid w-full grid-cols-3 bg-white border-0">
            <TabsTrigger value="recommend" className="text-sm">맞춤 추천</TabsTrigger>
            <TabsTrigger value="compare" className="text-sm">모델 비교</TabsTrigger>
            <TabsTrigger value="timeline" className="text-sm">타임라인</TabsTrigger>
          </TabsList>

          <TabsContent value="recommend" className="space-y-3 sm:space-y-4">
            {/* Task Input - 플랫한 디자인 */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Search className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">작업 내용 입력</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                어떤 작업을 하고 싶으신가요? (예: 블로그 글 작성, 코드 리뷰, 이미지 생성)
              </p>
              <div className="flex gap-2">
                <Input
                  placeholder="작업 내용 입력"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  className="text-sm border-gray-200"
                />
                <Button className="shrink-0 text-sm" onClick={handleTaskSearch}>
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                  <span className="hidden sm:inline">검색</span>
                </Button>
              </div>
            </div>

            {/* Recommended Models - 플랫한 디자인 */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">{jobCategory}을 위한 추천 모델</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                {jobCriteria
                  ? `${jobCriteria.primary_benchmark} · ${jobCriteria.secondary_benchmark} 벤치마크 기준`
                  : '벤치마크 기준 특화 모델 3개'}
              </p>

              {isLoadingJobRecommendations ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
                </div>
              ) : jobRecommendedModels.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    직업 정보를 설정하면 맞춤 모델을 추천받을 수 있습니다.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    마이페이지에서 프로필을 완성해보세요.
                  </p>
                </div>
              ) : (
              <div className="space-y-3">
                {jobRecommendedModels.map((model, index) => (
                  <div
                    key={model.model_id}
                    className="p-3 sm:p-4 rounded-xl bg-indigo-50/70 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shrink-0 text-sm ${
                          index === 0 ? 'bg-yellow-400 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          'bg-orange-400 text-white'
                        }`}>
                          {model.rank}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base truncate">{model.model_name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{model.creator_name}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="shrink-0 ml-2 text-xs">
                        {Number(model.weighted_score || 0).toFixed(1)}점
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <Badge variant="outline" className="text-xs bg-white">
                        {model.benchmark_scores.primary.name}: {Number(model.benchmark_scores.primary.score || 0).toFixed(1)}
                      </Badge>
                      <Badge variant="secondary" className="text-xs bg-white/50">
                        {model.benchmark_scores.secondary.name}: {Number(model.benchmark_scores.secondary.score || 0).toFixed(1)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="compare" className="space-y-3 sm:space-y-4">
            {/* Model Selection - 플랫한 디자인 */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">비교할 모델 선택</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                두 개의 AI 모델을 선택하여 성능을 비교해보세요
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Model A Selector */}
                <div className="space-y-2">
                  <Label className="text-sm">모델 A</Label>
                  <Select value={modelA} onValueChange={setModelA}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="모델 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingModels ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          로딩 중...
                        </div>
                      ) : availableModels.length === 0 ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          모델이 없습니다
                        </div>
                      ) : (
                        availableModels.map((model) => (
                          <SelectItem
                            key={model.model_id}
                            value={model.model_id}
                            disabled={model.model_id === modelB}
                            className="text-sm"
                          >
                            {model.model_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {/* Model B Selector */}
                <div className="space-y-2">
                  <Label className="text-sm">모델 B</Label>
                  <Select value={modelB} onValueChange={setModelB}>
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="모델 선택" />
                    </SelectTrigger>
                    <SelectContent>
                      {isLoadingModels ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          로딩 중...
                        </div>
                      ) : availableModels.length === 0 ? (
                        <div className="p-2 text-center text-sm text-muted-foreground">
                          모델이 없습니다
                        </div>
                      ) : (
                        availableModels.map((model) => (
                          <SelectItem
                            key={model.model_id}
                            value={model.model_id}
                            disabled={model.model_id === modelA}
                            className="text-sm"
                          >
                            {model.model_name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Model Cards Comparison */}
            {isComparing && (
              <div className="bg-white rounded-xl p-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">모델 비교 중...</p>
              </div>
            )}

            {comparisonError && !isComparing && modelA && modelB && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-sm text-red-800">{comparisonError}</p>
              </div>
            )}

            {comparisonResult && !isComparing && (
              <>
                {/* Model Info Cards - 플랫한 디자인 */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {/* Model A Card */}
                  <div className="bg-white rounded-xl overflow-hidden">
                    <div className="bg-indigo-50 p-3 sm:p-4 border-b-2 border-indigo-200">
                      <h3 className="text-sm sm:text-base line-clamp-1">{comparisonResult.model_a.model_name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{comparisonResult.model_a.creator_name}</p>
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="space-y-2 sm:space-y-3">
                        {/* 종합 점수 - 0이 아닐 때만 표시 */}
                        {parseFloat(comparisonResult.model_a.overall_score) > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">종합 점수</span>
                            <Badge variant="default" className="text-xs w-fit">
                              {comparisonResult.model_a.overall_score}점
                            </Badge>
                          </div>
                        )}
                        {/* 코딩 지수 - 0이 아닐 때만 표시 */}
                        {comparisonResult.model_a.scores.coding > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">코딩 지수</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {comparisonResult.model_a.scores.coding}점
                            </Badge>
                          </div>
                        )}
                        {/* 수학 지수 - 0이 아닐 때만 표시 */}
                        {comparisonResult.model_a.scores.math > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">수학 지수</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {comparisonResult.model_a.scores.math}점
                            </Badge>
                          </div>
                        )}
                        {/* 추론 지수 - 0이 아닐 때만 표시 */}
                        {comparisonResult.model_a.scores.reasoning > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">추론 지수</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {comparisonResult.model_a.scores.reasoning}점
                            </Badge>
                          </div>
                        )}
                        {/* 일반 지능 지수 - 0이 아닐 때만 표시 */}
                        {comparisonResult.model_a.scores.intelligence > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">일반 지능</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {comparisonResult.model_a.scores.intelligence}점
                            </Badge>
                          </div>
                        )}
                        {/* 데이터가 없을 경우 메시지 표시 */}
                        {parseFloat(comparisonResult.model_a.overall_score) === 0 &&
                         comparisonResult.model_a.scores.coding === 0 &&
                         comparisonResult.model_a.scores.math === 0 &&
                         comparisonResult.model_a.scores.reasoning === 0 &&
                         comparisonResult.model_a.scores.intelligence === 0 && (
                          <div className="text-xs text-muted-foreground text-center py-2">
                            종합 점수 데이터 없음
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Model B Card */}
                  <div className="bg-white rounded-xl overflow-hidden">
                    <div className="bg-purple-50 p-3 sm:p-4 border-b-2 border-purple-200">
                      <h3 className="text-sm sm:text-base line-clamp-1">{comparisonResult.model_b.model_name}</h3>
                      <p className="text-xs text-muted-foreground line-clamp-1">{comparisonResult.model_b.creator_name}</p>
                    </div>
                    <div className="p-3 sm:p-4">
                      <div className="space-y-2 sm:space-y-3">
                        {/* 종합 점수 - 0이 아닐 때만 표시 */}
                        {parseFloat(comparisonResult.model_b.overall_score) > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">종합 점수</span>
                            <Badge variant="default" className="text-xs w-fit">
                              {comparisonResult.model_b.overall_score}점
                            </Badge>
                          </div>
                        )}
                        {/* 코딩 지수 - 0이 아닐 때만 표시 */}
                        {comparisonResult.model_b.scores.coding > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">코딩 지수</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {comparisonResult.model_b.scores.coding}점
                            </Badge>
                          </div>
                        )}
                        {/* 수학 지수 - 0이 아닐 때만 표시 */}
                        {comparisonResult.model_b.scores.math > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">수학 지수</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {comparisonResult.model_b.scores.math}점
                            </Badge>
                          </div>
                        )}
                        {/* 추론 지수 - 0이 아닐 때만 표시 */}
                        {comparisonResult.model_b.scores.reasoning > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">추론 지수</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {comparisonResult.model_b.scores.reasoning}점
                            </Badge>
                          </div>
                        )}
                        {/* 일반 지능 지수 - 0이 아닐 때만 표시 */}
                        {comparisonResult.model_b.scores.intelligence > 0 && (
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">일반 지능</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {comparisonResult.model_b.scores.intelligence}점
                            </Badge>
                          </div>
                        )}
                        {/* 데이터가 없을 경우 메시지 표시 */}
                        {parseFloat(comparisonResult.model_b.overall_score) === 0 &&
                         comparisonResult.model_b.scores.coding === 0 &&
                         comparisonResult.model_b.scores.math === 0 &&
                         comparisonResult.model_b.scores.reasoning === 0 &&
                         comparisonResult.model_b.scores.intelligence === 0 && (
                          <div className="text-xs text-muted-foreground text-center py-2">
                            종합 점수 데이터 없음
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Meta Info Comparison - 플랫한 디자인 */}
                <div className="bg-white rounded-xl p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg mb-2">주요 지표 비교</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6">성능 및 가격 메타 정보</p>

                  <div className="space-y-4 sm:space-y-6">
                    {/* Coding Performance - 0이 아닐 때만 표시 */}
                    {(getModelData(modelA)!.scores.coding > 0 || getModelData(modelB)!.scores.coding > 0) && (
                      <>
                        <div className="space-y-2">
                          <div className="text-xs sm:text-sm text-center text-muted-foreground mb-2 sm:mb-3">코딩 성능</div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            {/* Model A */}
                            <div className="flex-1 text-right min-w-0">
                              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                                {getModelData(modelA)!.model_name}
                              </div>
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-base sm:text-xl">{getModelData(modelA)!.scores.coding}</span>
                                {getModelData(modelA)!.scores.coding > getModelData(modelB)!.scores.coding && (
                                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                                )}
                              </div>
                            </div>

                            {/* Comparison Bar */}
                            <div className="w-16 sm:w-32 h-2 bg-gray-200 rounded-full relative overflow-hidden shrink-0">
                              <div
                                className="absolute left-0 h-full bg-indigo-500 rounded-full transition-all"
                                style={{
                                  width: `${(getModelData(modelA)!.scores.coding / (getModelData(modelA)!.scores.coding + getModelData(modelB)!.scores.coding)) * 100}%`
                                }}
                              />
                              <div
                                className="absolute right-0 h-full bg-purple-500 rounded-full transition-all"
                                style={{
                                  width: `${(getModelData(modelB)!.scores.coding / (getModelData(modelA)!.scores.coding + getModelData(modelB)!.scores.coding)) * 100}%`
                                }}
                              />
                            </div>

                            {/* Model B */}
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                                {getModelData(modelB)!.model_name}
                              </div>
                              <div className="flex items-center gap-1">
                                {getModelData(modelB)!.scores.coding > getModelData(modelA)!.scores.coding && (
                                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                                )}
                                <span className="text-base sm:text-xl">{getModelData(modelB)!.scores.coding}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t pt-4 sm:pt-6" />
                      </>
                    )}

                    {/* Price Comparison - null이 아닐 때만 표시 */}
                    {(getModelData(modelA)!.pricing.price_blended_3to1 || getModelData(modelB)!.pricing.price_blended_3to1) && (
                      <>
                        <div className="space-y-2">
                          <div className="text-xs sm:text-sm text-center text-muted-foreground mb-2 sm:mb-3">가격 (blended 3:1)</div>
                          <div className="flex items-center gap-2 sm:gap-3">
                            {/* Model A */}
                            <div className="flex-1 text-right min-w-0">
                              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                                {getModelData(modelA)!.model_name}
                              </div>
                              <div className="flex items-center justify-end gap-1">
                                <span className="text-base sm:text-xl">
                                  {getModelData(modelA)!.pricing.price_blended_3to1 ? `$${getModelData(modelA)!.pricing.price_blended_3to1}` : 'N/A'}
                                </span>
                                {getModelData(modelA)!.pricing.price_blended_3to1 && getModelData(modelB)!.pricing.price_blended_3to1 &&
                                 parseFloat(getModelData(modelA)!.pricing.price_blended_3to1) < parseFloat(getModelData(modelB)!.pricing.price_blended_3to1) && (
                                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                                )}
                              </div>
                            </div>

                            {/* Comparison Bar (inverted for price - lower is better) */}
                            {getModelData(modelA)!.pricing.price_blended_3to1 && getModelData(modelB)!.pricing.price_blended_3to1 && (
                              <div className="w-16 sm:w-32 h-2 bg-gray-200 rounded-full relative overflow-hidden shrink-0">
                                <div
                                  className="absolute left-0 h-full bg-indigo-500 rounded-full transition-all"
                                  style={{
                                    width: `${(parseFloat(getModelData(modelB)!.pricing.price_blended_3to1) / (parseFloat(getModelData(modelA)!.pricing.price_blended_3to1) + parseFloat(getModelData(modelB)!.pricing.price_blended_3to1))) * 100}%`
                                  }}
                                />
                                <div
                                  className="absolute right-0 h-full bg-purple-500 rounded-full transition-all"
                                  style={{
                                    width: `${(parseFloat(getModelData(modelA)!.pricing.price_blended_3to1) / (parseFloat(getModelData(modelA)!.pricing.price_blended_3to1) + parseFloat(getModelData(modelB)!.pricing.price_blended_3to1))) * 100}%`
                                  }}
                                />
                              </div>
                            )}

                            {/* Model B */}
                            <div className="flex-1 text-left min-w-0">
                              <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                                {getModelData(modelB)!.model_name}
                              </div>
                              <div className="flex items-center gap-1">
                                {getModelData(modelA)!.pricing.price_blended_3to1 && getModelData(modelB)!.pricing.price_blended_3to1 &&
                                 parseFloat(getModelData(modelB)!.pricing.price_blended_3to1) < parseFloat(getModelData(modelA)!.pricing.price_blended_3to1) && (
                                  <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                                )}
                                <span className="text-base sm:text-xl">
                                  {getModelData(modelB)!.pricing.price_blended_3to1 ? `$${getModelData(modelB)!.pricing.price_blended_3to1}` : 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="border-t pt-4 sm:pt-6" />
                      </>
                    )}

                    {/* Overall Score - 0이 아닐 때만 표시 */}
                    {(parseFloat(getModelData(modelA)!.overall_score) > 0 || parseFloat(getModelData(modelB)!.overall_score) > 0) && (
                      <div className="space-y-2">
                        <div className="text-xs sm:text-sm text-center text-muted-foreground mb-2 sm:mb-3">종합 점수</div>
                        <div className="flex items-center gap-2 sm:gap-3">
                          {/* Model A */}
                          <div className="flex-1 text-right min-w-0">
                            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                              {getModelData(modelA)!.model_name}
                            </div>
                            <div className="flex items-center justify-end gap-1">
                              <span className="text-base sm:text-xl">{getModelData(modelA)!.overall_score}</span>
                              {parseFloat(getModelData(modelA)!.overall_score) > parseFloat(getModelData(modelB)!.overall_score) && (
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                              )}
                            </div>
                          </div>

                          {/* Comparison Bar */}
                          <div className="w-16 sm:w-32 h-2 bg-gray-200 rounded-full relative overflow-hidden shrink-0">
                            <div
                              className="absolute left-0 h-full bg-indigo-500 rounded-full transition-all"
                              style={{
                                width: `${(parseFloat(getModelData(modelA)!.overall_score) / (parseFloat(getModelData(modelA)!.overall_score) + parseFloat(getModelData(modelB)!.overall_score))) * 100}%`
                              }}
                            />
                            <div
                              className="absolute right-0 h-full bg-purple-500 rounded-full transition-all"
                              style={{
                                width: `${(parseFloat(getModelData(modelB)!.overall_score) / (parseFloat(getModelData(modelA)!.overall_score) + parseFloat(getModelData(modelB)!.overall_score))) * 100}%`
                              }}
                            />
                          </div>

                          {/* Model B */}
                          <div className="flex-1 text-left min-w-0">
                            <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                              {getModelData(modelB)!.model_name}
                            </div>
                            <div className="flex items-center gap-1">
                              {parseFloat(getModelData(modelB)!.overall_score) > parseFloat(getModelData(modelA)!.overall_score) && (
                                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                              )}
                              <span className="text-base sm:text-xl">{getModelData(modelB)!.overall_score}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 데이터가 없을 경우 메시지 표시 */}
                    {(getModelData(modelA)!.scores.coding === 0 && getModelData(modelB)!.scores.coding === 0) &&
                     (!getModelData(modelA)!.pricing.price_blended_3to1 && !getModelData(modelB)!.pricing.price_blended_3to1) &&
                     (parseFloat(getModelData(modelA)!.overall_score) === 0 && parseFloat(getModelData(modelB)!.overall_score) === 0) && (
                      <div className="text-sm text-muted-foreground text-center py-8">
                        주요 지표 데이터가 없습니다. 아래 벤치마크 상세 비교를 참고하세요.
                      </div>
                    )}
                  </div>
                </div>

                {/* Benchmark Comparison Chart - 플랫한 디자인 */}
                <div className="bg-white rounded-xl p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg mb-1">벤치마크 성능 비교</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4">각 벤치마크별 상세 점수</p>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={getComparisonData()} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        tick={{ fontSize: 10 }} 
                        angle={-15}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} width={35} />
                      <Tooltip contentStyle={{ fontSize: 11 }} />
                      <Legend 
                        wrapperStyle={{ fontSize: 10, paddingTop: '10px' }}
                        iconSize={10}
                      />
                      <Bar 
                        dataKey="scoreA" 
                        name={getModelData(modelA)!.model_name}
                        fill="#818cf8" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey="scoreB" 
                        name={getModelData(modelB)!.model_name}
                        fill="#c084fc" 
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                {/* Detailed Benchmark Table - 플랫한 디자인 */}
                <div className="bg-white rounded-xl p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg mb-4">벤치마크 상세 비교표</h2>
                  <div className="overflow-x-auto -mx-4 sm:mx-0">
                    <table className="w-full min-w-[280px]">
                      <thead>
                        <tr className="border-b-2">
                          <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">벤치마크</th>
                          <th className="text-center py-2 px-2 sm:py-3 sm:px-4 bg-indigo-50 text-xs sm:text-sm">
                            <span className="line-clamp-1">{getModelData(modelA)!.model_name}</span>
                          </th>
                          <th className="text-center py-2 px-2 sm:py-3 sm:px-4 bg-purple-50 text-xs sm:text-sm">
                            <span className="line-clamp-1">{getModelData(modelB)!.model_name}</span>
                          </th>
                          <th className="text-center py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">차이</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getComparisonData().map((benchmark) => {
                            const scoreA = benchmark.scoreA;
                            const scoreB = benchmark.scoreB;
                            const diff = (scoreA - scoreB).toFixed(1);
                            const diffNum = parseFloat(diff);
                            const benchmarkName = benchmark.name;
                            
                            return (
                              <tr key={benchmarkName} className="border-b hover:bg-gray-50 transition-colors">
                                <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">{benchmarkName}</td>
                                <td className={`text-center py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm ${scoreA > scoreB ? 'bg-green-50' : ''}`}>
                                  {scoreA}
                                </td>
                                <td className={`text-center py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm ${scoreB > scoreA ? 'bg-green-50' : ''}`}>
                                  {scoreB}
                                </td>
                                <td className="text-center py-2 px-2 sm:py-3 sm:px-4">
                                  <Badge variant={diffNum > 0 ? "default" : diffNum < 0 ? "secondary" : "outline"} className="text-xs">
                                    {diffNum > 0 ? '+' : ''}{diff}
                                  </Badge>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="timeline" className="space-y-3 sm:space-y-4">
            {/* Series Selection with Toggle Buttons - 플랫한 디자인 */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">시리즈 선택</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                비교할 AI 모델 시리즈를 선택하세요 (최대 5개)
              </p>
              <div className="flex flex-wrap gap-2">
                {availableSeriesList.length === 0 ? (
                  <p className="text-sm text-muted-foreground">로딩 중...</p>
                ) : (
                  availableSeriesList.map(series => {
                    const isSelected = comparisonSeries.includes(series.series_name);
                    const seriesColor =
                      series.series_name === 'GPT' ? 'bg-indigo-500' :
                      series.series_name === 'Claude' ? 'bg-purple-500' :
                      series.series_name === 'Gemini' ? 'bg-green-500' :
                      'bg-orange-500';

                    return (
                      <Button
                        key={series.series_name}
                        variant={isSelected ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleComparisonSeries(series.series_name)}
                        className={`text-xs sm:text-sm ${isSelected ? seriesColor : ''}`}
                      >
                        {series.series_name}
                        {isSelected && <span className="ml-1">✓</span>}
                      </Button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Vertical Timeline - 플랫한 디자인 */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">모델 출시 타임라인</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                선택한 시리즈의 모델 발전 과정
              </p>
              
              <div className="relative space-y-4">
                {/* Timeline vertical line */}
                <div className="absolute left-[19px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-green-500" />
                
                {getComparisonTimeline()
                  .slice(0, showAllTimeline ? undefined : 3)
                  .map((model, index) => {
                    const seriesColor = 
                      model.series === 'GPT' ? 'border-indigo-500 bg-indigo-50' :
                      model.series === 'Claude' ? 'border-purple-500 bg-purple-50' :
                      model.series === 'Gemini' ? 'border-green-500 bg-green-50' :
                      'border-orange-500 bg-orange-50';
                    
                    const badgeColor =
                      model.series === 'GPT' ? 'bg-indigo-500' :
                      model.series === 'Claude' ? 'bg-purple-500' :
                      model.series === 'Gemini' ? 'bg-green-500' :
                      'bg-orange-500';

                    return (
                      <motion.div
                        key={`${model.series}-${model.model_name}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start gap-3 sm:gap-4"
                      >
                        {/* Timeline dot */}
                        <div className={`relative w-10 h-10 rounded-full ${badgeColor} flex items-center justify-center shrink-0`}>
                          <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                        </div>
                        
                        {/* Content card */}
                        <div className={`flex-1 p-3 sm:p-4 rounded-xl border-2 ${seriesColor}`}>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="text-sm sm:text-base truncate">{model.model_name}</h3>
                                <Badge className={`shrink-0 text-xs ${badgeColor} text-white`}>
                                  {model.series}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                {new Date(model.release_date).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                            <Badge variant="outline" className="shrink-0 text-xs">
                              {model.overall_score}점
                            </Badge>
                          </div>
                          <div className="space-y-1">
                            {(model.major_improvements || []).map((improvement: string, idx: number) => (
                              <div key={idx} className="flex items-start gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-current mt-1.5 shrink-0" />
                                <p className="text-xs flex-1">{improvement}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
              
              {/* Show More/Less Button */}
              {getComparisonTimeline().length > 3 && (
                <div className="mt-4 text-center">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAllTimeline(!showAllTimeline)}
                    className="text-xs sm:text-sm"
                  >
                    {showAllTimeline ? (
                      <>접기 ↑</>
                    ) : (
                      <>더보기 ({getComparisonTimeline().length - 3}개 더) ↓</>
                    )}
                  </Button>
                </div>
              )}
            </div>

            {/* Benchmark Selector and Performance Chart - 플랫한 디자인 */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">벤치마크별 성능 추이</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                MMLU_PRO 벤치마크 기준 성능 발전
              </p>
              
              {/* Series selector for benchmark chart - Requirements 1.1, 1.2 */}
              <div className="mb-4">
                <Label className="text-sm mb-2 block">시리즈 선택</Label>
                <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="시리즈 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSeriesList.length === 0 ? (
                      <div className="p-2 text-center text-sm text-muted-foreground">
                        로딩 중...
                      </div>
                    ) : (
                      availableSeriesList.map((series) => (
                        <SelectItem key={series.series_name} value={series.series_name} className="text-sm">
                          {series.series_name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={getBenchmarkData()} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="model_name" 
                    tick={false}
                    height={20}
                  />
                  <YAxis domain={calculateYAxisDomain(getBenchmarkData())} tick={{ fontSize: 10 }} width={40} />
                  <Tooltip 
                    contentStyle={{ fontSize: 11 }}
                    formatter={(value: any, name: string) => {
                      if (name === 'score') return [value, 'MMLU_PRO 점수'];
                      if (name === 'improvement_from_previous') return [value ? `+${value}` : 'N/A', '이전 대비 향상'];
                      return [value, name];
                    }}
                  />
                  <Legend 
                    wrapperStyle={{ fontSize: 10, paddingTop: '10px' }}
                    iconSize={10}
                  />
                  <Line 
                    type="monotone"
                    dataKey="score" 
                    stroke="#818cf8" 
                    strokeWidth={2}
                    dot={{ r: 5, fill: '#818cf8' }}
                    name="MMLU_PRO 점수"
                  />
                </LineChart>
              </ResponsiveContainer>
              
              <p className="text-[10px] text-gray-400 mt-3 text-center">
                MMLU_PRO란? 성능을 평가하기 위한 추론 능력 측정 점수입니다.
              </p>
            </div>

            {/* Performance Comparison Table */}
            <div className="bg-white rounded-xl p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600" />
                <h2 className="text-base sm:text-lg">성능 개선 상세</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                각 모델의 벤치마크 점수 및 개선율
              </p>
              <div className="overflow-x-auto -mx-4 sm:mx-0">
                <table className="w-full min-w-[320px]">
                  <thead>
                    <tr className="border-b-2">
                      <th className="text-left py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">모델명</th>
                      <th className="text-center py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">출시일</th>
                      <th className="text-center py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">점수</th>
                      <th className="text-center py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">개선율</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getBenchmarkData().map((model, index) => (
                      <motion.tr
                        key={model.model_name}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                          {model.model_name}
                        </td>
                        <td className="text-center py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">
                          {new Date(model.release_date).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="text-center py-2 px-2 sm:py-3 sm:px-4">
                          <Badge variant="default" className="text-xs">
                            {model.score}점
                          </Badge>
                        </td>
                        <td className="text-center py-2 px-2 sm:py-3 sm:px-4">
                          {model.improvement_from_previous ? (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              +{model.improvement_from_previous}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}