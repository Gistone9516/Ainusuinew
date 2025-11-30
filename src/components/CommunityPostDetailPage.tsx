import { useState, useEffect } from 'react';
import { ArrowLeft, ThumbsUp, MessageCircle, MoreVertical, Edit, Trash2, Loader2 } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import type { Page } from '../App';
import * as CommunityAPI from '../lib/api/community';
import * as CommunityHelpers from '../lib/utils/communityHelpers';
import type { PostDetail, Comment } from '../types/community';

interface CommunityPostDetailPageProps {
  postId: number;
  onNavigate: (page: Page) => void;
  onBack: () => void;
  onEdit: (postId: number) => void;
}

export function CommunityPostDetailPage({ postId, onNavigate: _onNavigate, onBack, onEdit }: CommunityPostDetailPageProps) {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [showPostMenu, setShowPostMenu] = useState(false);
  const [showCommentMenu, setShowCommentMenu] = useState<number | null>(null);

  // Loading states
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingComments, setIsLoadingComments] = useState(false);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 게시글 및 댓글 조회
  useEffect(() => {
    fetchPost();
    fetchComments();
  }, [postId]);

  const fetchPost = async () => {
    setIsLoadingPost(true);
    setError(null);
    try {
      const response = await CommunityAPI.getPostDetail(postId);
      setPost(response.data);
    } catch (err: any) {
      console.error('Failed to fetch post:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoadingPost(false);
    }
  };

  const fetchComments = async () => {
    setIsLoadingComments(true);
    try {
      const response = await CommunityAPI.getComments(postId, {
        page: 1,
        limit: 50,
      });
      setComments(response.data.items);
    } catch (err: any) {
      console.error('Failed to fetch comments:', err);
    } finally {
      setIsLoadingComments(false);
    }
  };

  const handleLikePost = async () => {
    if (!post) return;

    // 낙관적 업데이트
    const prevLiked = post.is_liked;
    const prevCount = post.likes_count;

    setPost({
      ...post,
      is_liked: !post.is_liked,
      likes_count: post.is_liked ? post.likes_count - 1 : post.likes_count + 1,
    });

    try {
      await CommunityAPI.togglePostLike(postId);
    } catch (err: any) {
      console.error('Failed to toggle like:', err);
      // 실패 시 롤백
      setPost({
        ...post,
        is_liked: prevLiked,
        likes_count: prevCount,
      });
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !post) return;

    setIsSubmittingComment(true);
    try {
      const response = await CommunityAPI.createComment(postId, newComment);
      setComments([...comments, response.data]);
      setNewComment('');
      setPost({ ...post, comments_count: post.comments_count + 1 });
    } catch (err: any) {
      console.error('Failed to create comment:', err);
      alert('댓글 작성에 실패했습니다.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeletePost = async () => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return;

    try {
      await CommunityAPI.deletePost(postId);
      onBack();
    } catch (err: any) {
      console.error('Failed to delete post:', err);
      alert('게시글 삭제에 실패했습니다.');
    }
  };

  const isMyPost = post ? CommunityHelpers.isMyContent(post.author.user_id) : false;

  if (isLoadingPost) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="flex items-center justify-between p-4">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="p-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error || '게시글을 찾을 수 없습니다.'}</p>
            <button
              onClick={fetchPost}
              className="mt-2 text-sm text-indigo-600 hover:text-indigo-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </button>
          {isMyPost && (
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
                      onEdit(post.post_id);
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
            {CommunityHelpers.isHotPost(post) && (
              <Badge variant="destructive" className="text-xs">HOT</Badge>
            )}
          </div>

          <h1 className="mb-4">{post.title}</h1>

          <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
            <span>{post.author.nickname}</span>
            <span>·</span>
            <span>{CommunityHelpers.formatRelativeTime(post.created_at)}</span>
          </div>

          <div className="whitespace-pre-wrap mb-6 leading-relaxed">
            {post.content}
          </div>

          <div className="flex items-center gap-4 pt-4 border-t">
            <button
              onClick={handleLikePost}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                post.is_liked
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${post.is_liked ? 'fill-current' : ''}`} />
              <span>{post.likes_count}</span>
            </button>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MessageCircle className="h-4 w-4" />
              <span>{post.comments_count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments */}
      <div className="mt-2 bg-white">
        <div className="p-4 border-b">
          <h3>댓글 {comments.length}</h3>
        </div>

        {isLoadingComments ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-600" />
          </div>
        ) : (
          <div>
            {comments.length === 0 ? (
              <div className="py-8 text-center text-gray-500 text-sm">
                첫 댓글을 작성해보세요!
              </div>
            ) : (
              comments.map((comment, index) => {
                const isMyComment = CommunityHelpers.isMyContent(comment.author.user_id);
                return (
                  <div
                    key={comment.comment_id}
                    className={`px-4 py-4 ${index !== comments.length - 1 ? 'border-b' : ''}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{comment.author.nickname}</span>
                        <span className="text-xs text-muted-foreground">
                          {CommunityHelpers.formatRelativeTime(comment.created_at)}
                        </span>
                      </div>
                      {isMyComment && (
                        <div className="relative">
                          <button
                            onClick={() => setShowCommentMenu(showCommentMenu === comment.comment_id ? null : comment.comment_id)}
                            className="p-1 hover:bg-gray-100 rounded"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          {showCommentMenu === comment.comment_id && (
                            <div className="absolute right-0 mt-1 w-24 bg-white border rounded-lg shadow-lg z-10">
                              <button
                                onClick={() => {
                                  setShowCommentMenu(null);
                                  alert('댓글 수정 기능은 준비 중입니다.');
                                }}
                                className="w-full px-3 py-2 text-sm text-left hover:bg-gray-50 flex items-center gap-2"
                              >
                                <Edit className="h-3 w-3" />
                                수정
                              </button>
                              <button
                                onClick={() => {
                                  setShowCommentMenu(null);
                                  alert('댓글 삭제 기능은 준비 중입니다.');
                                }}
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
                  </div>
                );
              })
            )}
          </div>
        )}
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
            disabled={!newComment.trim() || isSubmittingComment}
            className="self-end"
          >
            {isSubmittingComment ? <Loader2 className="h-4 w-4 animate-spin" /> : '작성'}
          </Button>
        </div>
      </div>
    </div>
  );
}
