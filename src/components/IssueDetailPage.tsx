import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ArrowLeft, ExternalLink, Calendar, Tag, AlertCircle, RefreshCw } from 'lucide-react';
import type { Page } from '../App';
import * as IssueAPI from '../lib/api/issues';
import * as IssueHelpers from '../lib/utils/issueHelpers';
import type { Article } from '../types/issue';

interface ClusterData {
  title: string;
  tags: string[];
  score: number;
  articles: number;
  createdAt: string;
  updatedAt: string;
  cluster_id?: string;
  collected_at?: string;
  article_indices?: number[];
}

interface IssueDetailPageProps {
  cluster: ClusterData;
  onNavigate: (page: Page) => void;
  onBack: () => void;
}

export function IssueDetailPage({ cluster, onNavigate: _onNavigate, onBack }: IssueDetailPageProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const articlesPerPage = 10;

  // collected_at 추출 (cluster에서 또는 현재 시간 사용)
  const collectedAt = cluster.collected_at || new Date().toISOString();

  // 기사 데이터가 없을 때 표시할 상태
  const [noArticles, setNoArticles] = useState(false);

  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      setError(null);
      setNoArticles(false);

      // 디버깅: 전달된 클러스터 데이터 확인
      console.log('[IssueDetailPage] Cluster data:', {
        title: cluster.title,
        collected_at: cluster.collected_at,
        article_indices: cluster.article_indices,
        article_indices_length: cluster.article_indices?.length,
      });

      try {
        // cluster에 article_indices가 있는 경우
        if (cluster.article_indices && cluster.article_indices.length > 0) {
          // 페이지네이션을 위한 인덱스 계산
          const start = (currentPage - 1) * articlesPerPage;
          const end = start + articlesPerPage;
          const pageIndices = cluster.article_indices.slice(start, end);

          console.log('[IssueDetailPage] Fetching articles:', {
            collectedAt,
            pageIndices,
            start,
            end,
          });

          // API 호출
          const response = await IssueAPI.getArticles(collectedAt, pageIndices);
          
          console.log('[IssueDetailPage] Articles response:', response);
          
          if (response.data && response.data.length > 0) {
            setArticles(response.data);
          } else {
            setArticles([]);
            setNoArticles(true);
          }
        } else {
          // article_indices가 없는 경우 - 기사 데이터 없음
          console.log('[IssueDetailPage] No article_indices in cluster');
          setArticles([]);
          setNoArticles(true);
        }
      } catch (err: any) {
        console.error('[IssueDetailPage] Failed to fetch articles:', err);
        setError(err.response?.data?.message || '기사를 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, [cluster, currentPage, collectedAt]);

  // 재시도 핸들러
  const handleRetry = () => {
    setError(null);
    setNoArticles(false);
    setLoading(true);
    // useEffect가 다시 트리거되도록
    setCurrentPage(currentPage);
  };

  // 총 페이지 수 계산
  const totalPages = cluster.article_indices
    ? IssueHelpers.calculateTotalPages(cluster.article_indices.length, articlesPerPage)
    : Math.ceil(cluster.articles / articlesPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
            {/* 로딩 상태 */}
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
            ) : error ? (
              /* 에러 상태 */
              <div className="flex flex-col items-center justify-center py-8 text-center bg-red-50 rounded-lg">
                <AlertCircle className="h-10 w-10 text-red-400 mb-3" />
                <p className="text-red-600 font-medium">{error}</p>
                <button
                  onClick={handleRetry}
                  className="mt-3 flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  다시 시도
                </button>
              </div>
            ) : noArticles || articles.length === 0 ? (
              /* 데이터 없음 상태 */
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-600 font-medium">관련 기사 데이터가 없습니다</p>
                <p className="text-sm text-gray-400 mt-1">
                  이 클러스터에 연결된 기사 정보를 찾을 수 없습니다.
                </p>
                <button
                  onClick={handleRetry}
                  className="mt-4 flex items-center gap-2 px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                >
                  <RefreshCw className="h-4 w-4" />
                  다시 시도
                </button>
              </div>
            ) : (
              /* 기사 목록 */
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
                        {IssueHelpers.formatDateTime(article.pub_date)}
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

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        size="sm"
                        variant={currentPage === pageNum ? 'default' : 'outline'}
                        onClick={() => handlePageChange(pageNum)}
                        className="w-8 h-8 p-0"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  다음
                </Button>
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