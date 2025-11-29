import { useState, useEffect } from 'react';
import { Badge } from './ui/badge';
import { ThumbsUp, MessageCircle, PenSquare, ArrowUp } from 'lucide-react';
import type { UserData, Page } from '../App';
import { AppHeader } from './AppHeader';

interface CommunityPageProps {
  onNavigate: (page: Page) => void;
  onSelectPost: (postId: number) => void;
  onWrite: () => void;
}

export function CommunityPage({ onNavigate, onSelectPost, onWrite }: CommunityPageProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Mock user data for header
  const mockUserData: UserData = { username: '사용자' };

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      // 300px 이상 스크롤했을 때 버튼 표시
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  const posts = [
    {
      id: 1,
      category: 'prompt',
      title: 'GPT-4로 블로그 글 자동 생성하는 프롬프트 공유합니다',
      author: '프롬프트마스터',
      likes: 42,
      comments: 15,
      date: '2시간 전',
      isHot: true,
    },
    {
      id: 2,
      category: 'qna',
      title: 'Claude vs ChatGPT 어떤게 더 나을까요?',
      author: 'AI초보자',
      likes: 28,
      comments: 34,
      date: '4시간 전',
      isHot: true,
    },
    {
      id: 3,
      category: 'review',
      title: 'Midjourney V6 써본 후기 - 이미지 퀄리티 미쳤습니다',
      author: '디자이너김',
      likes: 56,
      comments: 22,
      date: '6시간 전',
      isHot: true,
    },
    {
      id: 4,
      category: 'daily',
      title: 'AI 덕분에 업무 시간 50% 단축했어요',
      author: '직장인박',
      likes: 35,
      comments: 18,
      date: '8시간 전',
      isHot: false,
    },
    {
      id: 5,
      category: 'notice',
      title: '[공지] 11월 AI 모델 추천 이벤트 안내',
      author: '운영진',
      likes: 15,
      comments: 5,
      date: '1일 전',
      isHot: false,
    },
    {
      id: 6,
      category: 'prompt',
      title: '코딩할 때 유용한 프롬프트 모음집',
      author: '개발자이',
      likes: 48,
      comments: 12,
      date: '1일 전',
      isHot: false,
    },
    {
      id: 7,
      category: 'qna',
      title: 'AI 학습 어디서부터 시작하면 좋을까요?',
      author: '학생최',
      likes: 22,
      comments: 28,
      date: '2일 전',
      isHot: false,
    },
    {
      id: 8,
      category: 'review',
      title: '업무에 AI 도입 후 생산성 3 증가 후기',
      author: '대표정',
      likes: 67,
      comments: 31,
      date: '2일 전',
      isHot: false,
    },
  ];

  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === selectedCategory);

  const getCategoryBadge = (category: string) => {
    const categoryMap: Record<string, string> = {
      prompt: '프롬프트',
      daily: '일상',
      qna: '질문',
      review: '후기',
      notice: '공지',
    };
    return categoryMap[category] || category;
  };

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

        {/* Posts */}
        <div className="bg-white">
          {filteredPosts.map((post, index) => (
            <div 
              key={post.id} 
              className={`px-4 py-4 hover:bg-gray-50 transition-colors cursor-pointer ${
                index !== filteredPosts.length - 1 ? 'border-b border-gray-200' : ''
              }`}
              onClick={() => onSelectPost(post.id)}
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">{getCategoryBadge(post.category)}</Badge>
                {post.isHot && (
                  <Badge variant="destructive" className="text-xs">HOT</Badge>
                )}
              </div>
              <h3 className="mb-2">{post.title}</h3>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{post.author}</span>
                <span>·</span>
                <span>{post.date}</span>
                <span>·</span>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <ThumbsUp className="h-3.5 w-3.5" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
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