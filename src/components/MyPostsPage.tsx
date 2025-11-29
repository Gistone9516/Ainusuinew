import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ThumbsUp, MessageCircle, Trash2 } from 'lucide-react';

interface MyPostsPageProps {
  onBack: () => void;
}

export function MyPostsPage({ onBack }: MyPostsPageProps) {
  const [posts, setPosts] = useState([
    {
      id: 1,
      category: 'prompt',
      title: 'GPT-4로 블로그 글 자동 생성하는 프롬프트 공유합니다',
      content: '안녕하세요! 최근에 GPT-4를 활용해서 블로그 글을 자동으로 생성하는 프롬프트를 만들었는데...',
      likes: 42,
      comments: 15,
      date: '2025-11-21',
      isHot: true,
    },
    {
      id: 2,
      category: 'daily',
      title: 'AI 덕분에 업무 시간 50% 단축했어요',
      content: '제 업무는 데이터 분석인데, AI를 활용하고 나서 정말 많은 시간을 절약할 수 있었습니다...',
      likes: 35,
      comments: 18,
      date: '2025-11-18',
      isHot: false,
    },
    {
      id: 3,
      category: 'review',
      title: 'Claude 3 한 달 사용 후기',
      content: 'Claude 3를 한 달 정도 사용해봤는데, ChatGPT와는 다른 매력이 있더라고요...',
      likes: 28,
      comments: 12,
      date: '2025-11-15',
      isHot: false,
    },
    {
      id: 4,
      category: 'qna',
      title: '프롬프트 엔지니어링 공부 방법 추천해주세요',
      content: '최근에 프롬프트 엔지니어링에 관심이 생겼는데, 어디서부터 시작해야 할지 모르겠어요...',
      likes: 19,
      comments: 24,
      date: '2025-11-12',
      isHot: false,
    },
  ]);

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

  const handleDelete = (id: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      setPosts(posts.filter(post => post.id !== id));
    }
  };

  return (
    <div className="min-h-screen p-4 pb-20 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="pt-4 pb-2">
          <Button variant="ghost" className="w-fit -ml-2 mb-2" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            뒤로
          </Button>
          <h1 className="text-3xl mt-2 mb-1" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>내 게시글</h1>
          <p className="text-muted-foreground">총 {posts.length}개의 게시글</p>
        </div>

        {/* Posts List */}
        <div className="space-y-3">
          {posts.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">작성한 게시글이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{getCategoryBadge(post.category)}</Badge>
                        {post.isHot && (
                          <Badge variant="destructive" className="text-xs">HOT</Badge>
                        )}
                      </div>
                      <h3 className="mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}