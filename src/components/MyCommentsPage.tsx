import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ThumbsUp, Trash2, ExternalLink } from 'lucide-react';

interface MyCommentsPageProps {
  onBack: () => void;
}

export function MyCommentsPage({ onBack }: MyCommentsPageProps) {
  const [comments, setComments] = useState([
    {
      id: 1,
      postTitle: 'Claude vs ChatGPT 어떤게 더 나을까요?',
      postCategory: 'qna',
      content: '저는 Claude를 주로 사용하는데, 긴 문맥을 이해하는 능력이 탁월한 것 같아요. 특히 코드 분석이나 문서 요약할 때 정말 좋습니다!',
      likes: 12,
      date: '2025-11-22',
    },
    {
      id: 2,
      postTitle: 'Midjourney V6 써본 후기 - 이미지 퀄리티 미쳤습니다',
      postCategory: 'review',
      content: '정말 동감합니다! V6는 특히 손과 얼굴 표현이 자연스러워진 게 가장 큰 장점인 것 같아요.',
      likes: 8,
      date: '2025-11-21',
    },
    {
      id: 3,
      postTitle: 'AI 학습 어디서부터 시작하면 좋을까요?',
      postCategory: 'qna',
      content: 'Andrew Ng 교수님의 Machine Learning 강의를 추천드립니다. 기초부터 차근차근 배울 수 있어요!',
      likes: 15,
      date: '2025-11-20',
    },
    {
      id: 4,
      postTitle: '프롬프트 엔지니어링 팁 공유',
      postCategory: 'prompt',
      content: '좋은 정보 감사합니다! 저도 요즘 프롬프트 작성에 많은 시간을 투자하고 있는데, 이런 팁들이 정말 유용하네요.',
      likes: 6,
      date: '2025-11-19',
    },
    {
      id: 5,
      postTitle: 'AI 도입 후 업무 효율 3배 증가',
      postCategory: 'daily',
      content: '저희 팀도 비슷한 경험이 있어요. 특히 반복 작업을 AI로 자동화하니까 정말 시간이 많이 절약되더라고요.',
      likes: 9,
      date: '2025-11-18',
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
      setComments(comments.filter(comment => comment.id !== id));
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
          <h1 className="text-3xl mt-2 mb-1" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>내 댓글</h1>
          <p className="text-muted-foreground">총 {comments.length}개의 댓글</p>
        </div>

        {/* Comments List */}
        <div className="space-y-3">
          {comments.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <p className="text-muted-foreground">작성한 댓글이 없습니다.</p>
              </CardContent>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Original Post Info */}
                  <div className="flex items-start justify-between mb-3 pb-3 border-b">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline" className="text-xs">
                          {getCategoryBadge(comment.postCategory)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">원글</span>
                      </div>
                      <p className="text-sm line-clamp-1">{comment.postTitle}</p>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Comment Content */}
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <p className="mb-3">{comment.content}</p>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <ThumbsUp className="h-4 w-4" />
                          <span>{comment.likes}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{comment.date}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(comment.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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