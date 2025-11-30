import { useState, useEffect } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ChevronLeft, ThumbsUp, MessageCircle, Trash2, Loader2 } from 'lucide-react';
import { getCurrentUser, getMyPosts, deletePost } from '@/lib/api/user';
import { formatRelativeTime } from '@/lib/utils/userHelpers';
import type { MyPost } from '@/types/user';

interface MyPostsPageProps {
  onBack: () => void;
}

export function MyPostsPage({ onBack }: MyPostsPageProps) {
  const [posts, setPosts] = useState<MyPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const user = await getCurrentUser();
        const result = await getMyPosts(user.user_id);
        setPosts(result.items);
      } catch (err: any) {
        console.error('Failed to load posts:', err);
        setError('게시글을 불러오는데 실패했습니다.');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

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

  const handleDelete = async (postId: number) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      try {
        await deletePost(postId);
        setPosts(posts.filter(post => post.post_id !== postId));
        alert('게시글이 삭제되었습니다.');
      } catch (err: any) {
        console.error('Failed to delete post:', err);
        alert('게시글 삭제에 실패했습니다.');
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
            <h1 className="text-3xl mt-2 mb-1" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>내 게시글</h1>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-600" />
              <p className="text-muted-foreground">게시글을 불러오는 중...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-4 pb-20 bg-gray-50">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="pt-4 pb-2">
            <Button variant="ghost" className="w-fit -ml-2 mb-2" onClick={onBack}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              뒤로
            </Button>
            <h1 className="text-3xl mt-2 mb-1" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>내 게시글</h1>
          </div>
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-destructive mb-2">{error}</p>
              <Button onClick={() => window.location.reload()}>다시 시도</Button>
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
              <Card key={post.post_id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline">{getCategoryBadge(post.category)}</Badge>
                        {post.is_hot && (
                          <Badge variant="destructive" className="text-xs">HOT</Badge>
                        )}
                      </div>
                      <h3 className="mb-2">{post.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{formatRelativeTime(post.created_at)}</span>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(post.post_id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <ThumbsUp className="h-4 w-4" />
                      <span>{post.like_count}</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MessageCircle className="h-4 w-4" />
                      <span>{post.comment_count}</span>
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