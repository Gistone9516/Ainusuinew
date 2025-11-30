import React from 'react';
import { useState, useEffect } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import * as CommunityAPI from '../lib/api/community';
import * as CommunityHelpers from '../lib/utils/communityHelpers';

interface CommunityWritePageProps {
  postId?: number;
  onBack: () => void;
  onSave: () => void;
}

export function CommunityWritePage({ postId, onBack, onSave }: CommunityWritePageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 수정 모드일 경우 기존 게시글 로드
  useEffect(() => {
    if (postId) {
      fetchPost();
    }
  }, [postId]);

  const fetchPost = async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await CommunityAPI.getPostDetail(postId);
      setTitle(response.data.title);
      setContent(response.data.content);
    } catch (err: any) {
      console.error('Failed to fetch post:', err);
      setError('게시글을 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    // 유효성 검사
    const titleValidation = CommunityHelpers.validateTitle(title);
    if (!titleValidation.isValid) {
      alert(titleValidation.error);
      return;
    }

    const contentValidation = CommunityHelpers.validateContent(content);
    if (!contentValidation.isValid) {
      alert(contentValidation.error);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (postId) {
        // 수정
        await CommunityAPI.updatePost(postId, { title, content });
      } else {
        // 작성
        await CommunityAPI.createPost({ title, content });
      }
      onSave();
    } catch (err: any) {
      console.error('Failed to save post:', err);
      setError(postId ? '게시글 수정에 실패했습니다.' : '게시글 작성에 실패했습니다.');
      alert(error || '저장에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2>{postId ? '게시글 수정' : '글쓰기'}</h2>
          <Button onClick={handleSubmit} size="sm" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              postId ? '수정' : '완료'
            )}
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mx-4 mt-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Form */}
      <div className="p-4 space-y-6">
        {/* Title */}
        <div className="space-y-2">
          <Label>제목</Label>
          <Input
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground text-right">
            {title.length}/100
          </p>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label>내용</Label>
          <Textarea
            value={content}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setContent(e.target.value)}
            placeholder="내용을 입력하세요 (최소 10자)"
            className="min-h-[400px]"
            maxLength={5000}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground text-right">
            {content.length}/5000
          </p>
        </div>

        {/* Guidelines */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm mb-2">커뮤니티 이용 안내</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• 존중과 배려로 건전한 커뮤니티를 만들어주세요</li>
            <li>• 개인정보 및 민감한 정보 공유를 자제해주세요</li>
            <li>• 광고 및 홍보성 게시글은 제한될 수 있습니다</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
