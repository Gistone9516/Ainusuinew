import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChevronLeft, User, Lock, Loader2 } from 'lucide-react';
import type { Page } from '../App';
import { getExtendedUser, updateProfile, getJobCategories } from '@/lib/api/user';
import { validateNickname, validateTagSelection } from '@/lib/utils/userHelpers';
import { INTEREST_TAGS, GENDER_OPTIONS, type Gender, type JobCategoryData } from '@/types/user';

interface ProfileEditPageProps {
  onSave: () => void;
  onBack: () => void;
  onNavigate?: (page: Page) => void;
}

export function ProfileEditPage({ onSave, onBack, onNavigate }: ProfileEditPageProps) {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // User data
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState<Gender | ''>('');
  const [jobCategoryId, setJobCategoryId] = useState<number | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Job categories from API
  const [jobCategories, setJobCategories] = useState<JobCategoryData[]>([]);

  // Errors
  const [errors, setErrors] = useState<{
    nickname?: string;
    tags?: string;
  }>({});

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const [user, categories] = await Promise.all([
        getExtendedUser(),
        getJobCategories(),
      ]);

      setNickname(user.nickname);
      setEmail(user.email);
      setGender(user.gender || '');
      setJobCategoryId(user.job_category_id || null);
      setSelectedTags(user.interest_tags || []);
      setJobCategories(categories);
    } catch (error) {
      console.error('Failed to load user data:', error);
      alert('사용자 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      // 최대 10개 제한
      if (selectedTags.length >= 10) {
        alert('관심 태그는 최대 10개까지 선택할 수 있습니다.');
        return;
      }
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSave = async () => {
    const newErrors: typeof errors = {};

    // Validate nickname
    const nicknameValidation = validateNickname(nickname);
    if (!nicknameValidation.isValid) {
      newErrors.nickname = nicknameValidation.error;
    }

    // Validate tags
    const tagsValidation = validateTagSelection(selectedTags, 10);
    if (!tagsValidation.isValid) {
      newErrors.tags = tagsValidation.error;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    try {
      setSaving(true);
      await updateProfile({
        nickname,
        gender: gender || undefined,
        job_category_id: jobCategoryId || undefined,
        interest_tags: selectedTags,
      });
      alert('프로필이 성공적으로 수정되었습니다.');
      onSave();
    } catch (error: any) {
      console.error('Failed to update profile:', error);
      alert('프로필 수정에 실패했습니다.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl mx-auto pt-20">
          <Card>
            <CardContent className="p-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-indigo-600" />
              <p className="text-muted-foreground">프로필 정보를 불러오는 중...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
              <Label htmlFor="nickname">닉네임</Label>
              <Input
                id="nickname"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임을 입력하세요"
              />
              {errors.nickname && (
                <p className="text-sm text-red-500">{errors.nickname}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">이메일 (읽기 전용)</Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">
                이메일은 변경할 수 없습니다.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Password Change */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-600" />
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
              {GENDER_OPTIONS.map((g) => (
                <button
                  key={g.value}
                  onClick={() => setGender(g.value as Gender)}
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
              {jobCategories.map((j) => (
                <button
                  key={j.job_category_id}
                  onClick={() => setJobCategoryId(j.job_category_id)}
                  className={`p-3 rounded-lg border-2 transition-all text-sm ${
                    jobCategoryId === j.job_category_id
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {j.job_name}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Tags Selection */}
        <Card>
          <CardHeader>
            <CardTitle>관심 태그</CardTitle>
            <CardDescription>
              선택된 태그: {selectedTags.length}/10개
              {errors.tags && <span className="text-red-500 ml-2">{errors.tags}</span>}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-60 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {INTEREST_TAGS.map((tag) => {
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
                      disabled={!isSelected && selectedTags.length >= 10}
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
          <Button onClick={handleSave} className="w-full" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                저장 중...
              </>
            ) : (
              '저장하기'
            )}
          </Button>
          <Button onClick={onBack} variant="outline" className="w-full" disabled={saving}>
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}