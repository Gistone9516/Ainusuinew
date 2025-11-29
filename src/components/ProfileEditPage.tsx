import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Badge } from './ui/badge';
import { ChevronLeft, User } from 'lucide-react';
import type { UserData } from '../App';

interface ProfileEditPageProps {
  userData: UserData;
  onSave: (data: Partial<UserData>) => void;
  onBack: () => void;
  onNavigate?: (page: string) => void;
}

const allTags = [
  'LLM', '컴퓨터비전', '자연어처리', '머신러닝', '강화학습', '연합학습',
  '모델경량화', '프롬프트엔지니어링', '에지AI', '윤리AI', 'AI보안', '개인화추천',
  '콘텐츠생성', '이미지생성', '영상생성', '코드생성', '글쓰기지원', '번역',
  '음성합성', '음성인식', '채팅봇', '감정분석', '데이터분석', '예측분석',
  '자동화', '업무효율화', '의사결정지원', '마케팅자동화', '검색최적화', '가격결정',
  'AI일자리', 'AI윤리', 'AI규제', 'AI성능', '모델출시', '오픈소스',
  '의료진단', '교육지원', '비용절감', '기술트렌드',
];

const jobs = [
  { value: 'tech', label: '기술/개발' },
  { value: 'creative', label: '창작/콘텐츠' },
  { value: 'analysis', label: '분석/사무' },
  { value: 'healthcare', label: '의료/과학' },
  { value: 'education', label: '교육' },
  { value: 'business', label: '비즈니스' },
  { value: 'manufacturing', label: '제조/건설' },
  { value: 'service', label: '서비스' },
  { value: 'startup', label: '창업/자영업' },
  { value: 'agriculture', label: '농업/축산업' },
  { value: 'fisheries', label: '어업/해상업' },
  { value: 'student', label: '학생' },
  { value: 'others', label: '기타' },
];

const genders = [
  { value: 'male', label: '남성' },
  { value: 'female', label: '여성' },
  { value: 'other', label: '기타' },
  { value: 'prefer-not-to-say', label: '선택 안 함' },
];

export function ProfileEditPage({ userData, onSave, onBack, onNavigate }: ProfileEditPageProps) {
  const [username, setUsername] = useState(userData.username || '');
  const [email, setEmail] = useState(userData.email || '');
  const [gender, setGender] = useState(userData.gender || '');
  const [job, setJob] = useState(userData.job || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(userData.tags || []);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = () => {
    onSave({
      username,
      email,
      gender,
      job,
      tags: selectedTags,
    });
  };

  return (
    <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="pt-4 pb-2">
          <Button variant="ghost" onClick={onBack} className="-ml-2">
            <ChevronLeft className="h-4 w-4 mr-1" />
            뒤로
          </Button>
        </div>

        {/* Profile Info */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              <CardTitle>기본 정보</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">아이디</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="아이디를 입력하세요"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="이메일을 입력하세요"
              />
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-indigo-600" />
              <CardTitle>비밀번호 변경</CardTitle>
            </div>
            <CardDescription>
              계정 보안을 위해 정기적으로 비밀번호를 변경해주세요
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => onNavigate?.('password-change')}
            >
              비밀번호 변경하기
            </Button>
          </CardContent>
        </Card>

        {/* Gender Selection */}
        <Card>
          <CardHeader>
            <CardTitle>성별</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {genders.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGender(g.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    gender === g.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {g.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Job Selection */}
        <Card>
          <CardHeader>
            <CardTitle>직업</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {jobs.map((j) => (
                <button
                  key={j.value}
                  onClick={() => setJob(j.value)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    job === j.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {j.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags Selection */}
        <Card>
          <CardHeader>
            <CardTitle>관심 태그</CardTitle>
            <CardDescription>선택된 태그: {selectedTags.length}개</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="space-y-2 pb-4">
          <Button onClick={handleSave} className="w-full">
            저장하기
          </Button>
          <Button onClick={onBack} variant="outline" className="w-full">
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}