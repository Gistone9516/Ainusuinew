import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Sparkles, Search, BarChart3, ArrowRight, TrendingUp, TrendingDown, Clock, GitBranch, Zap, ArrowLeft, Loader2, Award } from 'lucide-react';
import type { UserData, Page } from '../App';
import { AppHeader } from './AppHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { motion } from 'motion/react';

interface ModelPageProps {
  userData: UserData;
  onNavigate: (page: Page) => void;
}

// Task recommendation API types
interface TaskClassification {
  task_category_id: number;
  category_code: string;
  category_name_ko: string;
  category_name_en: string;
  confidence_score: number;
  reasoning: string;
}

interface BenchmarkScore {
  name: string;
  score: number;
  weight: number;
  contribution: number;
}

interface RecommendedModel {
  rank: number;
  model_id: string;
  model_name: string;
  creator_name: string;
  weighted_score: number;
  benchmark_scores: {
    primary: BenchmarkScore;
    secondary: BenchmarkScore;
  };
  overall_score: number;
  pricing: {
    input_price: number;
    output_price: number;
  };
}

interface TaskRecommendationResult {
  classification: TaskClassification;
  criteria: {
    primary_benchmark: string;
    secondary_benchmark: string;
    weights: {
      primary: number;
      secondary: number;
    };
  };
  recommended_models: RecommendedModel[];
  metadata: {
    total_models_evaluated: number;
    classification_time_ms: number;
    recommendation_time_ms: number;
  };
}

export function ModelPage({ userData, onNavigate }: ModelPageProps) {
  const [taskInput, setTaskInput] = useState('');
  const [modelA, setModelA] = useState<string>('');
  const [modelB, setModelB] = useState<string>('');
  
  // Task recommendation states
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<TaskRecommendationResult | null>(null);
  const [showSearchResult, setShowSearchResult] = useState(false);
  
  // Timeline tab states
  const [selectedSeries, setSelectedSeries] = useState<string>('GPT');
  const [comparisonSeries, setComparisonSeries] = useState<string[]>(['GPT', 'Claude']);
  const [selectedBenchmark, setSelectedBenchmark] = useState<string>('MMLU_PRO');
  const [showAllTimeline, setShowAllTimeline] = useState<boolean>(false);
  
  // Mock data for timeline features
  const availableSeries = [
    { series_name: 'GPT', model_count: 12, latest_model: 'GPT-4 Turbo', latest_release: '2024-11-01' },
    { series_name: 'Claude', model_count: 8, latest_model: 'Claude 3.5 Sonnet', latest_release: '2024-10-15' },
    { series_name: 'Gemini', model_count: 6, latest_model: 'Gemini Ultra', latest_release: '2024-09-20' },
    { series_name: 'LLaMA', model_count: 5, latest_model: 'LLaMA 3 70B', latest_release: '2024-08-10' },
  ];

  const timelineData = {
    GPT: [
      {
        model_name: 'GPT-4 Turbo',
        release_date: '2024-11-01',
        overall_score: 85.7,
        major_improvements: ['컨텍스트 128K', '성능 15% 향상', '멀티모달 강화']
      },
      {
        model_name: 'GPT-4',
        release_date: '2023-03-14',
        overall_score: 82.1,
        major_improvements: ['멀티모달 지원', 'GPT-3.5 대비 40% 성능 향상']
      },
      {
        model_name: 'GPT-3.5 Turbo',
        release_date: '2022-11-30',
        overall_score: 75.3,
        major_improvements: ['속도 개선', '비용 효율성']
      },
    ],
    Claude: [
      {
        model_name: 'Claude 3.5 Sonnet',
        release_date: '2024-10-15',
        overall_score: 87.3,
        major_improvements: ['코딩 능력 향상', '추론 강화']
      },
      {
        model_name: 'Claude 3 Opus',
        release_date: '2024-03-04',
        overall_score: 84.2,
        major_improvements: ['멀티모달 지원', '긴 컨텍스트']
      },
      {
        model_name: 'Claude 2.1',
        release_date: '2023-11-21',
        overall_score: 78.5,
        major_improvements: ['200K 토큰 지원', '정확도 향상']
      },
    ],
    Gemini: [
      {
        model_name: 'Gemini Ultra',
        release_date: '2024-09-20',
        overall_score: 83.4,
        major_improvements: ['멀티모달 통합', '실시간 처리']
      },
      {
        model_name: 'Gemini Pro',
        release_date: '2023-12-06',
        overall_score: 79.8,
        major_improvements: ['비용 효율성', '다국어 지원']
      },
    ],
    LLaMA: [
      {
        model_name: 'LLaMA 3 70B',
        release_date: '2024-08-10',
        overall_score: 79.2,
        major_improvements: ['오픈소스', '효율적 추론']
      },
      {
        model_name: 'LLaMA 2 70B',
        release_date: '2023-07-18',
        overall_score: 72.4,
        major_improvements: ['상업적 사용 가능', '안전성 개선']
      },
    ],
  };

  const benchmarkProgressionData = {
    GPT: [
      { model_name: 'GPT-4 Turbo', release_date: '2024-11-01', score: 84.5, improvement_from_previous: 3.2 },
      { model_name: 'GPT-4', release_date: '2023-03-14', score: 81.3, improvement_from_previous: 7.8 },
      { model_name: 'GPT-3.5 Turbo', release_date: '2022-11-30', score: 73.5, improvement_from_previous: null },
    ],
    Claude: [
      { model_name: 'Claude 3.5 Sonnet', release_date: '2024-10-15', score: 86.2, improvement_from_previous: 4.1 },
      { model_name: 'Claude 3 Opus', release_date: '2024-03-04', score: 82.1, improvement_from_previous: 5.3 },
      { model_name: 'Claude 2.1', release_date: '2023-11-21', score: 76.8, improvement_from_previous: null },
    ],
  };

  const getSeriesTimeline = (series: string) => {
    return timelineData[series as keyof typeof timelineData] || [];
  };

  const getComparisonTimeline = () => {
    const allEvents: any[] = [];
    comparisonSeries.forEach(series => {
      const timeline = getSeriesTimeline(series);
      timeline.forEach(model => {
        allEvents.push({
          ...model,
          series,
        });
      });
    });
    return allEvents.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
  };

  const getBenchmarkData = () => {
    const data = benchmarkProgressionData[selectedSeries as keyof typeof benchmarkProgressionData] || [];
    // 과거 -> 최신 순서로 정렬 (왼쪽에서 오른쪽으로 시간이 흐르도록)
    return [...data].reverse();
  };

  const toggleComparisonSeries = (series: string) => {
    if (comparisonSeries.includes(series)) {
      if (comparisonSeries.length > 1) {
        setComparisonSeries(comparisonSeries.filter(s => s !== series));
      }
    } else {
      if (comparisonSeries.length < 5) {
        setComparisonSeries([...comparisonSeries, series]);
      }
    }
  };

  // Mock detailed model data with API structure
  const detailedModels = [
    {
      model_id: 'gpt-4-turbo',
      model_name: 'GPT-4 Turbo',
      creator_name: 'OpenAI',
      overall_score: 85.7,
      coding_index: 95.2,
      price_blended_3to1: 17.5,
      category: 'LLM',
      benchmarks: {
        MMLU_PRO: 84.5,
        HumanEval: 92.3,
        GSM8K: 88.1,
        MATH: 79.4,
      }
    },
    {
      model_id: 'claude-3.5-sonnet',
      model_name: 'Claude 3.5 Sonnet',
      creator_name: 'Anthropic',
      overall_score: 87.3,
      coding_index: 92.8,
      price_blended_3to1: 15.0,
      category: 'LLM',
      benchmarks: {
        MMLU_PRO: 86.2,
        HumanEval: 89.7,
        GSM8K: 91.5,
        MATH: 82.3,
      }
    },
    {
      model_id: 'gemini-ultra',
      model_name: 'Gemini Ultra',
      creator_name: 'Google',
      overall_score: 83.4,
      coding_index: 88.5,
      price_blended_3to1: 12.8,
      category: '멀티모달',
      benchmarks: {
        MMLU_PRO: 81.7,
        HumanEval: 85.2,
        GSM8K: 86.9,
        MATH: 75.8,
      }
    },
    {
      model_id: 'llama-3-70b',
      model_name: 'LLaMA 3 70B',
      creator_name: 'Meta',
      overall_score: 79.2,
      coding_index: 82.1,
      price_blended_3to1: 8.5,
      category: 'LLM',
      benchmarks: {
        MMLU_PRO: 78.3,
        HumanEval: 79.8,
        GSM8K: 82.4,
        MATH: 71.2,
      }
    },
  ];

  // Recommendation models (keeping for recommend tab)
  const recommendedModels = [
    {
      name: 'GitHub Copilot',
      category: '코드생성',
      score: 94,
      benchmarks: {
        '코딩 정확도': 95,
        '속도': 92,
        '비용 효율': 88,
      },
      description: '코드 작성을 위한 최고의 AI 도구',
    },
    {
      name: 'GPT-4 Turbo',
      category: 'LLM',
      score: 93,
      benchmarks: {
        '이해력': 96,
        '추론': 94,
        '창의성': 91,
      },
      description: '범용 작업에 최적화된 강력한 LLM',
    },
    {
      name: 'Claude 3 Opus',
      category: 'LLM',
      score: 92,
      benchmarks: {
        '이해력': 95,
        '추론': 93,
        '안전성': 97,
      },
      description: '윤리적이고 안전한 AI 어시스턴트',
    },
  ];

  const getModelData = (modelId: string) => {
    return detailedModels.find(m => m.model_id === modelId);
  };

  const getComparisonData = () => {
    const dataA = getModelData(modelA);
    const dataB = getModelData(modelB);
    
    if (!dataA || !dataB) return [];

    return Object.keys(dataA.benchmarks).map(key => ({
      name: key,
      [dataA.model_name]: dataA.benchmarks[key as keyof typeof dataA.benchmarks],
      [dataB.model_name]: dataB.benchmarks[key as keyof typeof dataB.benchmarks],
    }));
  };

  // Mock API function for task classification and recommendation
  const classifyAndRecommend = async (userInput: string): Promise<TaskRecommendationResult> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock response data
    return {
      classification: {
        task_category_id: 3,
        category_code: 'coding',
        category_name_ko: '코딩/개발',
        category_name_en: 'Coding',
        confidence_score: 0.95,
        reasoning: `"${userInput}"는 프로그래밍 및 코드 작성과 관련된 작업으로 분류됩니다.`
      },
      criteria: {
        primary_benchmark: 'LiveCodeBench',
        secondary_benchmark: 'HumanEval',
        weights: {
          primary: 0.7,
          secondary: 0.3
        }
      },
      recommended_models: [
        {
          rank: 1,
          model_id: 'gpt-4-turbo',
          model_name: 'GPT-4 Turbo',
          creator_name: 'OpenAI',
          weighted_score: 94.2,
          benchmark_scores: {
            primary: {
              name: 'LiveCodeBench',
              score: 72.3,
              weight: 0.7,
              contribution: 50.61
            },
            secondary: {
              name: 'HumanEval',
              score: 92.3,
              weight: 0.3,
              contribution: 27.69
            }
          },
          overall_score: 85.7,
          pricing: {
            input_price: 10.0,
            output_price: 30.0
          }
        },
        {
          rank: 2,
          model_id: 'claude-3.5-sonnet',
          model_name: 'Claude 3.5 Sonnet',
          creator_name: 'Anthropic',
          weighted_score: 91.8,
          benchmark_scores: {
            primary: {
              name: 'LiveCodeBench',
              score: 68.5,
              weight: 0.7,
              contribution: 47.95
            },
            secondary: {
              name: 'HumanEval',
              score: 89.7,
              weight: 0.3,
              contribution: 26.91
            }
          },
          overall_score: 87.3,
          pricing: {
            input_price: 3.0,
            output_price: 15.0
          }
        },
        {
          rank: 3,
          model_id: 'gemini-ultra',
          model_name: 'Gemini Ultra',
          creator_name: 'Google',
          weighted_score: 88.5,
          benchmark_scores: {
            primary: {
              name: 'LiveCodeBench',
              score: 65.2,
              weight: 0.7,
              contribution: 45.64
            },
            secondary: {
              name: 'HumanEval',
              score: 85.2,
              weight: 0.3,
              contribution: 25.56
            }
          },
          overall_score: 83.4,
          pricing: {
            input_price: 7.0,
            output_price: 21.0
          }
        }
      ],
      metadata: {
        total_models_evaluated: 5,
        classification_time_ms: 1250,
        recommendation_time_ms: 180
      }
    };
  };

  // Handle task search
  const handleTaskSearch = async () => {
    if (!taskInput.trim()) return;
    
    setIsSearching(true);
    try {
      const result = await classifyAndRecommend(taskInput);
      setSearchResult(result);
      setShowSearchResult(true);
    } catch (error) {
      console.error('Error searching tasks:', error);
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
                {searchResult.recommended_models.map((model, index) => (
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
                        {model.weighted_score.toFixed(1)}점
                      </Badge>
                    </div>

                    {/* Benchmark Scores */}
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="p-2 bg-white/70 rounded-lg">
                        <p className="text-[10px] text-muted-foreground mb-0.5">{model.benchmark_scores.primary.name}</p>
                        <p className="text-xs sm:text-sm">{model.benchmark_scores.primary.score} 점</p>
                        <p className="text-[10px] text-green-600">기여도: {model.benchmark_scores.primary.contribution.toFixed(1)}</p>
                      </div>
                      <div className="p-2 bg-white/70 rounded-lg">
                        <p className="text-[10px] text-muted-foreground mb-0.5">{model.benchmark_scores.secondary.name}</p>
                        <p className="text-xs sm:text-sm">{model.benchmark_scores.secondary.score} 점</p>
                        <p className="text-[10px] text-green-600">기여도: {model.benchmark_scores.secondary.contribution.toFixed(1)}</p>
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
                <h2 className="text-base sm:text-lg">{userData.job || '당신'}을 위한 추천 모델</h2>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mb-4">벤치마크 기준 특화 모델 3개</p>
              
              <div className="space-y-3">
                {recommendedModels.map((model, index) => (
                  <div
                    key={model.name}
                    className="p-3 sm:p-4 rounded-xl bg-indigo-50/70 hover:bg-indigo-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2 sm:mb-3">
                      <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                        <div className={`flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full shrink-0 text-sm ${
                          index === 0 ? 'bg-yellow-400 text-white' :
                          index === 1 ? 'bg-gray-400 text-white' :
                          'bg-orange-400 text-white'
                        }`}>
                          {index + 1}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm sm:text-base truncate">{model.name}</h3>
                          <p className="text-xs sm:text-sm text-muted-foreground line-clamp-1">{model.description}</p>
                        </div>
                      </div>
                      <Badge variant="default" className="shrink-0 ml-2 text-xs">{model.score}점</Badge>
                    </div>
                    <div className="flex flex-wrap gap-1.5 sm:gap-2">
                      <Badge variant="outline" className="text-xs bg-white">{model.category}</Badge>
                      {Object.entries(model.benchmarks).map(([key, value]) => (
                        <Badge key={key} variant="secondary" className="text-xs bg-white/50">
                          {key}: {value}점
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
                      {detailedModels.map((model) => (
                        <SelectItem 
                          key={model.model_id} 
                          value={model.model_id}
                          disabled={model.model_id === modelB}
                          className="text-sm"
                        >
                          {model.model_name}
                        </SelectItem>
                      ))}
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
                      {detailedModels.map((model) => (
                        <SelectItem 
                          key={model.model_id} 
                          value={model.model_id}
                          disabled={model.model_id === modelA}
                          className="text-sm"
                        >
                          {model.model_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Model Cards Comparison */}
            {modelA && modelB && (
              <>
                {/* Model Info Cards - 플랫한 디자인 */}
                <div className="grid grid-cols-2 gap-2 sm:gap-4">
                  {/* Model A Card */}
                  {getModelData(modelA) && (
                    <div className="bg-white rounded-xl overflow-hidden">
                      <div className="bg-indigo-50 p-3 sm:p-4 border-b-2 border-indigo-200">
                        <h3 className="text-sm sm:text-base line-clamp-1">{getModelData(modelA)!.model_name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{getModelData(modelA)!.creator_name}</p>
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">종합 점수</span>
                            <Badge variant="default" className="text-xs w-fit">
                              {getModelData(modelA)!.overall_score}점
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">카테고리</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {getModelData(modelA)!.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Model B Card */}
                  {getModelData(modelB) && (
                    <div className="bg-white rounded-xl overflow-hidden">
                      <div className="bg-purple-50 p-3 sm:p-4 border-b-2 border-purple-200">
                        <h3 className="text-sm sm:text-base line-clamp-1">{getModelData(modelB)!.model_name}</h3>
                        <p className="text-xs text-muted-foreground line-clamp-1">{getModelData(modelB)!.creator_name}</p>
                      </div>
                      <div className="p-3 sm:p-4">
                        <div className="space-y-2 sm:space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">종합 점수</span>
                            <Badge variant="default" className="text-xs w-fit">
                              {getModelData(modelB)!.overall_score}점
                            </Badge>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                            <span className="text-xs text-muted-foreground">카테고리</span>
                            <Badge variant="outline" className="text-xs w-fit">
                              {getModelData(modelB)!.category}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Meta Info Comparison - 플랫한 디자인 */}
                <div className="bg-white rounded-xl p-4 sm:p-6">
                  <h2 className="text-base sm:text-lg mb-2">주요 지표 비교</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-6">성능 및 가격 메타 정보</p>
                  
                  <div className="space-y-4 sm:space-y-6">
                    {/* Coding Performance */}
                    <div className="space-y-2">
                      <div className="text-xs sm:text-sm text-center text-muted-foreground mb-2 sm:mb-3">코딩 성능</div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Model A */}
                        <div className="flex-1 text-right min-w-0">
                          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                            {getModelData(modelA)!.model_name}
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-base sm:text-xl">{getModelData(modelA)!.coding_index}</span>
                            {getModelData(modelA)!.coding_index > getModelData(modelB)!.coding_index && (
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                            )}
                          </div>
                        </div>

                        {/* Comparison Bar */}
                        <div className="w-16 sm:w-32 h-2 bg-gray-200 rounded-full relative overflow-hidden shrink-0">
                          <div 
                            className="absolute left-0 h-full bg-indigo-500 rounded-full transition-all"
                            style={{ 
                              width: `${(getModelData(modelA)!.coding_index / (getModelData(modelA)!.coding_index + getModelData(modelB)!.coding_index)) * 100}%` 
                            }}
                          />
                          <div 
                            className="absolute right-0 h-full bg-purple-500 rounded-full transition-all"
                            style={{ 
                              width: `${(getModelData(modelB)!.coding_index / (getModelData(modelA)!.coding_index + getModelData(modelB)!.coding_index)) * 100}%` 
                            }}
                          />
                        </div>

                        {/* Model B */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                            {getModelData(modelB)!.model_name}
                          </div>
                          <div className="flex items-center gap-1">
                            {getModelData(modelB)!.coding_index > getModelData(modelA)!.coding_index && (
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                            )}
                            <span className="text-base sm:text-xl">{getModelData(modelB)!.coding_index}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 sm:pt-6" />

                    {/* Price Comparison */}
                    <div className="space-y-2">
                      <div className="text-xs sm:text-sm text-center text-muted-foreground mb-2 sm:mb-3">가격 (blended 3:1)</div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Model A */}
                        <div className="flex-1 text-right min-w-0">
                          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                            {getModelData(modelA)!.model_name}
                          </div>
                          <div className="flex items-center justify-end gap-1">
                            <span className="text-base sm:text-xl">${getModelData(modelA)!.price_blended_3to1}</span>
                            {getModelData(modelA)!.price_blended_3to1 < getModelData(modelB)!.price_blended_3to1 && (
                              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                            )}
                          </div>
                        </div>

                        {/* Comparison Bar (inverted for price - lower is better) */}
                        <div className="w-16 sm:w-32 h-2 bg-gray-200 rounded-full relative overflow-hidden shrink-0">
                          <div 
                            className="absolute left-0 h-full bg-indigo-500 rounded-full transition-all"
                            style={{ 
                              width: `${(getModelData(modelB)!.price_blended_3to1 / (getModelData(modelA)!.price_blended_3to1 + getModelData(modelB)!.price_blended_3to1)) * 100}%` 
                            }}
                          />
                          <div 
                            className="absolute right-0 h-full bg-purple-500 rounded-full transition-all"
                            style={{ 
                              width: `${(getModelData(modelA)!.price_blended_3to1 / (getModelData(modelA)!.price_blended_3to1 + getModelData(modelB)!.price_blended_3to1)) * 100}%` 
                            }}
                          />
                        </div>

                        {/* Model B */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                            {getModelData(modelB)!.model_name}
                          </div>
                          <div className="flex items-center gap-1">
                            {getModelData(modelB)!.price_blended_3to1 < getModelData(modelA)!.price_blended_3to1 && (
                              <TrendingDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                            )}
                            <span className="text-base sm:text-xl">${getModelData(modelB)!.price_blended_3to1}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-4 sm:pt-6" />

                    {/* Overall Score */}
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
                            {getModelData(modelA)!.overall_score > getModelData(modelB)!.overall_score && (
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                            )}
                          </div>
                        </div>

                        {/* Comparison Bar */}
                        <div className="w-16 sm:w-32 h-2 bg-gray-200 rounded-full relative overflow-hidden shrink-0">
                          <div 
                            className="absolute left-0 h-full bg-indigo-500 rounded-full transition-all"
                            style={{ 
                              width: `${(getModelData(modelA)!.overall_score / (getModelData(modelA)!.overall_score + getModelData(modelB)!.overall_score)) * 100}%` 
                            }}
                          />
                          <div 
                            className="absolute right-0 h-full bg-purple-500 rounded-full transition-all"
                            style={{ 
                              width: `${(getModelData(modelB)!.overall_score / (getModelData(modelA)!.overall_score + getModelData(modelB)!.overall_score)) * 100}%` 
                            }}
                          />
                        </div>

                        {/* Model B */}
                        <div className="flex-1 text-left min-w-0">
                          <div className="text-[10px] sm:text-xs text-muted-foreground mb-1 truncate">
                            {getModelData(modelB)!.model_name}
                          </div>
                          <div className="flex items-center gap-1">
                            {getModelData(modelB)!.overall_score > getModelData(modelA)!.overall_score && (
                              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 shrink-0" />
                            )}
                            <span className="text-base sm:text-xl">{getModelData(modelB)!.overall_score}</span>
                          </div>
                        </div>
                      </div>
                    </div>
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
                        dataKey={getModelData(modelA)!.model_name} 
                        fill="#818cf8" 
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar 
                        dataKey={getModelData(modelB)!.model_name} 
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
                        {Object.keys(getModelData(modelA)!.benchmarks).map((benchmark) => {
                          const modelAData = getModelData(modelA)!;
                          const modelBData = getModelData(modelB)!;
                          const scoreA = modelAData.benchmarks[benchmark as keyof typeof modelAData.benchmarks];
                          const scoreB = modelBData.benchmarks[benchmark as keyof typeof modelBData.benchmarks];
                          const diff = (scoreA - scoreB).toFixed(1);
                          
                          return (
                            <tr key={benchmark} className="border-b hover:bg-gray-50 transition-colors">
                              <td className="py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm">{benchmark}</td>
                              <td className={`text-center py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm ${scoreA > scoreB ? 'bg-green-50' : ''}`}>
                                {scoreA}
                              </td>
                              <td className={`text-center py-2 px-2 sm:py-3 sm:px-4 text-xs sm:text-sm ${scoreB > scoreA ? 'bg-green-50' : ''}`}>
                                {scoreB}
                              </td>
                              <td className="text-center py-2 px-2 sm:py-3 sm:px-4">
                                <Badge variant={scoreA > scoreB ? "default" : scoreB > scoreA ? "secondary" : "outline"} className="text-xs">
                                  {diff > 0 ? '+' : ''}{diff}
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
                {availableSeries.map(series => {
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
                })}
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
                            {model.major_improvements.map((improvement: string, idx: number) => (
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
              
              {/* Series selector for benchmark chart */}
              <div className="mb-4">
                <Label className="text-sm mb-2 block">시리즈 선택</Label>
                <Select value={selectedSeries} onValueChange={setSelectedSeries}>
                  <SelectTrigger className="text-sm">
                    <SelectValue placeholder="시리즈 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {['GPT', 'Claude'].map((series) => (
                      <SelectItem key={series} value={series} className="text-sm">
                        {series}
                      </SelectItem>
                    ))}
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
                  <YAxis domain={[70, 90]} tick={{ fontSize: 10 }} width={40} />
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