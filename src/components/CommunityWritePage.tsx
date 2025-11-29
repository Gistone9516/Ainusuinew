import React from 'react';
import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';

interface CommunityWritePageProps {
  postId?: number;
  onBack: () => void;
  onSave: () => void;
}

export function CommunityWritePage({ postId, onBack, onSave }: CommunityWritePageProps) {
  const [category, setCategory] = useState('prompt');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const categories = [
    { value: 'prompt', label: '프롬프트 공유' },
    { value: 'daily', label: '일상/잡담' },
    { value: 'qna', label: '질문/답변' },
    { value: 'review', label: '후기/리뷰' },
  ];

  // Load post data if editing
  useEffect(() => {
    if (postId) {
      // Mock data for editing
      setCategory('prompt');
      setTitle('GPT-4로 블로그 글 자동 생성하는 프롬프트 공유합니다');
      setContent(`안녕하세요! 오늘은 GPT-4를 활용해서 블로그 글을 자동으로 생성하는 프롬프트를 공유하려고 합니다.

저는 이 프롬프트를 사용해서 매주 2-3개의 블로그 포스팅을 자동으로 작성하고 있는데요, 정말 효율적이더라고요.`);
    }
  }, [postId]);

  const handleSubmit = () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    // Save post
    onSave();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center justify-between p-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h2>{postId ? '게시글 수정' : '글쓰기'}</h2>
          <Button onClick={handleSubmit} size="sm">
            {postId ? '수정' : '완료'}
          </Button>
        </div>
      </div>

      {/* Form */}
      <div className="p-4 space-y-6">
        {/* Category */}
        <div className="space-y-2">
          <Label>카테고리</Label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setCategory(cat.value)}
                className={`px-4 py-2 rounded-full transition-colors ${
                  category === cat.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label>제목</Label>
          <Input
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            maxLength={100}
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
            placeholder="내용을 입력하세요"
            className="min-h-[400px]"
            maxLength={5000}
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