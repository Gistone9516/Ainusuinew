import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { ThumbsUp, MessageCircle, PenSquare, ArrowUp, Loader2, Eye } from 'lucide-react';
import type { UserData, Page } from '../App';
import { AppHeader } from './AppHeader';
import * as CommunityAPI from '../lib/api/community';
import * as CommunityHelpers from '../lib/utils/communityHelpers';
import type { Post } from '../types/community';

interface CommunityPageProps {
  onNavigate: (page: Page) => void;
  onSelectPost: (postId: number) => void;
  onWrite: () => void;
}

export function CommunityPage({ onNavigate, onSelectPost, onWrite }: CommunityPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'recent' | 'popular' | 'views'>('recent');

  // Mock user data for header
  const mockUserData: UserData = { username: '사용자' };

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 게시글 목록 조회
  useEffect(() => {
    fetchPosts();
  }, [sortBy]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await CommunityAPI.getPosts({
        page: 1,
        limit: 20,
        sort: sortBy,
      });
      setPosts(response.data.items);
    } catch (err: any) {
      console.error('Failed to fetch posts:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 맨 위로 스크롤
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'prompt', label: '프롬프트 공유' },
    { value: 'daily', label: '일상/잡담' },
    { value: 'qna', label: '질문/답변' },
    { value: 'review', label: '후기/리뷰' },
    { value: 'notice', label: '공지/이벤트' },
  ];

  // 카테고리별 필터링 (프론트엔드)
  // API에 카테고리 필드가 없으므로 현재는 전체 표시
  const filteredPosts = posts;

  return (
    <div className="min-h-screen pb-20 bg-gray-50">
      <AppHeader
        userData={mockUserData}
        onNavigate={onNavigate}
        title="커뮤니티"
        subtitle="AI에 관한 모든 이야기를 나눠보세요"
      />
      <div className="space-y-4">
        {/* Categories */}
        <div className="bg-white px-4 py-3 border-b">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Options */}
        <div className="bg-white px-4 py-2 border-b">
          <div className="flex gap-2">
            <button
              onClick={() => setSortBy('recent')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                sortBy === 'recent'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              최신순
            </button>
            <button
              onClick={() => setSortBy('popular')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                sortBy === 'popular'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              인기순
            </button>
            <button
              onClick={() => setSortBy('views')}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                sortBy === 'views'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              조회순
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mx-4">
            <p className="text-red-600 text-sm">{error}</p>
            <button
              onClick={fetchPosts}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
            >
              다시 시도
            </button>
          </div>
        )}

        {/* Posts */}
        {!isLoading && !error && (
          <div className="bg-white">
            {filteredPosts.length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                게시글이 없습니다.
              </div>
            ) : (
              filteredPosts.map((post, index) => {
                const isHot = CommunityHelpers.isHotPost(post);
                return (
                  <div
                    key={post.post_id}
                    className={`px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                      index !== filteredPosts.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                    onClick={() => onSelectPost(post.post_id)}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {isHot && (
                        <Badge variant="destructive" className="text-xs">HOT</Badge>
                      )}
                    </div>
                    <h3 className="mb-2">{post.title}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{post.author.nickname}</span>
                      <span>·</span>
                      <span>{CommunityHelpers.formatRelativeTime(post.created_at)}</span>
                      <span>·</span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="h-3.5 w-3.5" />
                          <span>{post.likes_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-3.5 w-3.5" />
                          <span>{post.comments_count}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="h-3.5 w-3.5" />
                          <span>{post.views_count}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      {/* Floating Write Button */}
      <button
        onClick={onWrite}
        className="fixed bottom-24 right-6 bg-indigo-600 text-white p-4 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-10"
      >
        <PenSquare className="h-6 w-6" />
      </button>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-24 left-6 bg-indigo-600/80 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700/90 transition-all z-10 backdrop-blur-sm"
          aria-label="맨 위로"
        >
          <ArrowUp className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
