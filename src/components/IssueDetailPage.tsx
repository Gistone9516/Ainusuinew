import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowLeft, ExternalLink, Calendar, Tag } from 'lucide-react';
import type { Page } from '../App';

interface Article {
  article_index: number;
  title: string;
  link: string;
  description: string;
  pub_date: string;
  source: string;
}

interface ClusterData {
  title: string;
  tags: string[];
  score: number;
  articles: number;
  createdAt: string;
  updatedAt: string;
}

interface IssueDetailPageProps {
  cluster: ClusterData;
  onNavigate: (page: Page) => void;
  onBack: () => void;
}

export function IssueDetailPage({ cluster, onNavigate, onBack }: IssueDetailPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock API call to fetch articles
    // In real implementation, this would call:
    // GET /api/issue-index/articles?collected_at=2025-01-01T14:00:00Z&indices=0,1,2
    
    const fetchArticles = async () => {
      setLoading(true);
      
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Mock data based on the API response format
      const mockArticles: Article[] = [
        {
          article_index: 0,
          title: 'OpenAI, GPT-5 개발 중단 발표',
          link: 'https://news.example.com/article/123',
          description: 'OpenAI가 GPT-5 개발을 중단한다고 발표했습니다. 이는 AI 안전성에 대한 우려가 반영된 결정으로 보입니다...',
          pub_date: '2025-01-01T12:30:00.000Z',
          source: 'naver'
        },
        {
          article_index: 1,
          title: 'GPT-5 개발 중단, 업계 반응은?',
          link: 'https://news.example.com/article/124',
          description: 'OpenAI의 GPT-5 개발 중단 소식에 AI 업계가 다양한 반응을 보이고 있습니다. 전문가들은 이번 결정이 AI 윤리와 안전성을 중시하는 흐름이라고 평가합니다...',
          pub_date: '2025-01-01T13:15:00.000Z',
          source: 'daum'
        },
        {
          article_index: 2,
          title: 'AI 안전성 강화 움직임 확산',
          link: 'https://news.example.com/article/125',
          description: 'OpenAI의 GPT-5 개발 중단을 계기로 AI 업계 전반에 안전성 강화 움직임이 확산되고 있습니다. 다른 AI 기업들도 유사한 조치를 고려 중인 것으로 알려졌습니다...',
          pub_date: '2025-01-01T14:00:00.000Z',
          source: 'naver'
        },
        {
          article_index: 3,
          title: 'GPT-4 개선 버전 출시 예정',
          link: 'https://news.example.com/article/126',
          description: 'OpenAI는 GPT-5 대신 GPT-4의 개선 버전을 출시할 계획이라고 밝혔습니다. 안전성과 성능을 모두 개선한 모델이 될 것으로 기대됩니다...',
          pub_date: '2025-01-01T15:20:00.000Z',
          source: 'google'
        },
      ];
      
      setArticles(mockArticles.slice(0, cluster.articles > 10 ? 10 : cluster.articles));
      setLoading(false);
    };

    fetchArticles();
  }, [cluster]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getSourceBadgeColor = (source: string) => {
    const colors: Record<string, string> = {
      naver: 'bg-green-100 text-green-800',
      daum: 'bg-blue-100 text-blue-800',
      google: 'bg-red-100 text-red-800',
    };
    return colors[source] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center p-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h2 className="ml-2">뉴스 클러스터 상세</h2>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Cluster Info */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between mb-3">
              <CardTitle className="flex-1 pr-4">{cluster.title}</CardTitle>
              <Badge variant="outline" className="text-lg px-3 py-1">
                {cluster.score}점
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex flex-wrap gap-2">
              {cluster.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  <Tag className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span>생성</span>
                </div>
                <span className="text-gray-700">{cluster.createdAt}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-muted-foreground">갱신</span>
                <span className="text-gray-700">{cluster.updatedAt}</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <span className="text-muted-foreground">총 기사</span>
                <span className="text-gray-700">{cluster.articles}개</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Articles List */}
        <Card>
          <CardHeader>
            <CardTitle>관련 기사 목록</CardTitle>
            <CardDescription>
              이 클러스터를 구성하는 기사들입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="p-4 border rounded-lg animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {articles.map((article) => (
                  <div
                    key={article.article_index}
                    className="p-4 border rounded-lg hover:border-indigo-300 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="flex-1 pr-4">{article.title}</h3>
                      <Badge className={getSourceBadgeColor(article.source)}>
                        {article.source}
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-3">
                      {article.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {formatDate(article.pub_date)}
                      </span>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(article.link, '_blank')}
                      >
                        <ExternalLink className="h-3 w-3 mr-1" />
                        원문 보기
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Back Button */}
        <Button onClick={onBack} variant="outline" className="w-full">
          목록으로 돌아가기
        </Button>
      </div>
    </div>
  );
}