import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, ThumbsUp, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { getMyComments, deleteComment } from '@/lib/api/user';
import type { MyComment } from '@/types/user';

interface MyCommentsPageProps {
  onBack: () => void;
}

export function MyCommentsPage({ onBack }: MyCommentsPageProps) {
  const [comments, setComments] = useState<MyComment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadComments();
  }, []);

  const loadComments = async () => {
    try {
      setLoading(true);
      const result = await getMyComments();
      setComments(result.items);
    } catch (error) {
      console.error('Failed to load comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deleteComment(commentId);
        setComments(comments.filter(comment => comment.comment_id !== commentId));
        alert('댓글이 삭제되었습니다.');
      } catch (error) {
        console.error('Failed to delete comment:', error);
        alert('댓글 삭제에 실패했습니다.');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 pb-20 bg-gray-50">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="pt-4 pb-2">
            <Button variant="ghost" className="w-fit -ml-2 mb-2" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              뒤로
            </Button>
            <h1 className="text-3xl mt-2 mb-1" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>내 댓글</h1>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-600" />
              <p className="text-muted-foreground">댓글을 불러오는 중...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
                <p className="text-xs text-muted-foreground mt-2">
                  백엔드 API가 준비되면 댓글 목록을 표시합니다.
                </p>
              </CardContent>
            </Card>
          ) : (
            comments.map((comment) => (
              <Card key={comment.comment_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  {/* Original Post Info */}
                  <div className="flex items-start justify-between mb-3 pb-3 border-b">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm text-muted-foreground">원글</span>
                      </div>
                      <p className="text-sm line-clamp-1">{comment.post_title}</p>
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
                          <span>{comment.likes_count}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{comment.created_at}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(comment.comment_id)}
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