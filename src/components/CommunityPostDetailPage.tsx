import { useState } from 'react';
import { ArrowLeft, ThumbsUp, MessageCircle, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import type { Page } from '../App';

interface Comment {
  id: number;
  author: string;
  content: string;
  date: string;
  likes: number;
  isLiked: boolean;
  isMyComment: boolean;
}

interface Post {
  id: number;
  category: string;
  title: string;
  author: string;
  content: string;
  likes: number;
  comments: number;
  date: string;
  isHot: boolean;
  isLiked: boolean;
  isMyPost: boolean;
}

interface CommunityPostDetailPageProps {
  postId: number;
  onNavigate: (page: Page) => void;
  onBack: () => void;
  onEdit: (postId: number) => void;
}

export function CommunityPostDetailPage({ postId, onNavigate, onBack, onEdit }: CommunityPostDetailPageProps) {
  // Mock post data
  const [post, setPost] = useState<Post>({
    id: postId,
    category: 'prompt',
    title: 'GPT-4로 블로그 글 자동 생성하는 프롬프트 공유합니다',
    author: '프롬프트마스터',
    content: `안녕하세요! 오늘은 GPT-4를 활용해서 블로그 글을 자동으로 생성하는 프롬프트를 공유하려고 합니다.

저는 이 프롬프트를 사용해서 매주 2-3개의 블로그 포스팅을 자동으로 작성하고 있는데요, 정말 효율적이더라고요.

**프롬프트:**
"주제: [주제 입력]
독자: [타겟 독자]
톤앤매너: 전문적이면서도 친근하게
분량: 1500-2000자
구성: 서론-본론-결론, 각 섹션에 소제목 포함
SEO 키워드: [키워드 3개]

위 조건으로 블로그 글을 작성해주세요."

이렇게 사용하시면 됩니다. 도움이 되셨으면 좋겠습니다!`,
    likes: 42,
    comments: 15,
    date: '2시간 전',
    isHot: true,
    isLiked: false,
    isMyPost: true,
  });

  const [comments, setComments] = useState<Comment[]>([
    {
      id: 1,
      author: 'AI초보자',
      content: '와 정말 유용한 프롬프트네요! 바로 써봐야겠습니다. 감사합니다!',
      date: '1시간 전',
      likes: 5,
      isLiked: false,
      isMyComment: false,
    },
    {
      id: 2,
      author: '블로거김',
      content: '저도 비슷하게 사용하고 있는데, SEO 키워드 부분이 특히 좋은 것 같아요.',
      date: '50분 전',
      likes: 3,
      isLiked: true,
      isMyComment: false,
    },
    {
      id: 3,
      author: '작가박',
      content: '혹시 GPT-3.5로도 비슷한 퀄리티가 나올까요?',
      date: '30분 전',
      likes: 1,
      isLiked: false,
      isMyComment: true,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
  const [editingCommentContent, setEditingCommentContent] = useState('');
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState<number | null>(null);

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

  const handleLikePost = () => {
    setPost({
      ...post,
      isLiked: !post.isLiked,
      likes: post.isLiked ? post.likes - 1 : post.likes + 1,
    });
  };

  const handleLikeComment = (commentId: number) => {
    setComments(comments.map(comment => 
      comment.id === commentId
        ? { ...comment, isLiked: !comment.isLiked, likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1 }
        : comment
    ));
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    
    const comment: Comment = {
      id: Date.now(),
      author: '나',
      content: newComment,
      date: '방금 전',
      likes: 0,
      isLiked: false,
      isMyComment: true,
    };
    
    setComments([...comments, comment]);
    setNewComment('');
    setPost({ ...post, comments: post.comments + 1 });
  };

  const handleStartEditComment = (comment: Comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentContent(comment.content);
    setShowCommentMenu(null);
  };

  const handleSaveEditComment = (commentId: number) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, content: editingCommentContent }
        : comment
    ));
    setEditingCommentId(null);
    setEditingCommentContent('');
  };

  const handleDeleteComment = (commentId: number) => {
    if (confirm('댓글을 삭제하시겠습니까?')) {
      setComments(comments.filter(comment => comment.id !== commentId));
      setPost({ ...post, comments: post.comments - 1 });
      setShowCommentMenu(null);
    }
  };

  const handleDeletePost = () => {
    if (confirm('게시글을 삭제하시겠습니까?')) {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </button>
          {post.isMyPost && (
            <div className="relative">
              <button 
                onClick={() => setShowPostMenu(!showPostMenu)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
              {showPostMenu && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-lg shadow-lg">
                  <button
                    onClick={() => {
                      setShowPostMenu(false);
                      onEdit(post.id);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Edit className="h-4 w-4" />
                    수정
                  </button>
                  <button
                    onClick={handleDeletePost}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                    삭제
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="bg-white border-b">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="outline" className="text-xs">{getCategoryBadge(post.category)}</Badge>
            {post.isHot && (
              <Badge variant="destructive" className="text-xs">HOT</Badge>
            )}
          </div>
          
          <h1 className="mb-4">{post.title}</h1>
          
          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span>{post.author}</span>
            <span>·</span>
            <span>{post.date}</span>
          </div>

          <div className="whitespace-pre-wrap mb-6 leading-relaxed">
            {post.content}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              onClick={handleLikePost}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                post.isLiked 
                  ? 'bg-indigo-50 text-indigo-600' 
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${post.isLiked ? 'fill-current' : ''}`} />
              <span>{post.likes}</span>
            </button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-2 bg-white">
        <div className="p-4 border-b">
          <h3>댓글 {comments.length}</h3>
        </div>

        <div>
          {comments.map((comment, index) => (
            <div 
              key={comment.id}
              className={`px-4 py-4 ${index !== comments.length - 1 ? 'border-b' : ''}`}
            >
              {editingCommentId === comment.id ? (
                <div className="space-y-2">
                  <Textarea
                    value={editingCommentContent}
                    onChange={(e) => setEditingCommentContent(e.target.value)}
                    className="min-h-[80px]"
                  />
                  <div className="flex gap-2">
                    <Button 
                      size="sm"
                      onClick={() => handleSaveEditComment(comment.id)}
                    >
                      저장
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditingCommentContent('');
                      }}
                    >
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{comment.author}</span>
                      <span className="text-xs text-muted-foreground">{comment.date}</span>
                    </div>
                    {comment.isMyComment && (
                      <div className="relative">
                        <button
                          onClick={() => setShowCommentMenu(showCommentMenu === comment.id ? null : comment.id)}
                          className="p-1 hover:bg-gray-100 rounded"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showCommentMenu === comment.id && (
                          <div className="absolute right-0 mt-1 w-24 bg-white border rounded-lg shadow-lg z-10">
                            <button
                              onClick={() => handleStartEditComment(comment)}
                              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
                            >
                              <Edit className="h-3 w-3" />
                              수정
                            </button>
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2 text-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                              삭제
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <p className="text-sm mb-2">{comment.content}</p>
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className={`flex items-center gap-1 text-xs ${
                      comment.isLiked ? 'text-indigo-600' : 'text-muted-foreground'
                    }`}
                  >
                    <ThumbsUp className={`h-3 w-3 ${comment.isLiked ? 'fill-current' : ''}`} />
                    <span>{comment.likes}</span>
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Comment Input */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="flex gap-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요..."
            className="flex-1 min-h-[44px] max-h-[120px] resize-none"
          />
          <Button 
            onClick={handleAddComment}
            disabled={!newComment.trim()}
            className="self-end"
          >
            작성
          </Button>
        </div>
      </div>
    </div>
  );
}