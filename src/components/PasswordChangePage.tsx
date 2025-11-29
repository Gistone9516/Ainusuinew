import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { ChevronLeft, Lock, Eye, EyeOff } from 'lucide-react';

interface PasswordChangePageProps {
  onBack: () => void;
  onSave: () => void;
}

export function PasswordChangePage({ onBack, onSave }: PasswordChangePageProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  }>({});

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return '비밀번호는 최소 8자 이상이어야 합니다.';
    }
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return '비밀번호는 영문과 숫자를 포함해야 합니다.';
    }
    return null;
  };

  const handleSubmit = () => {
    const newErrors: typeof errors = {};

    // Validate current password
    if (!currentPassword) {
      newErrors.currentPassword = '현재 비밀번호를 입력해주세요.';
    }

    // Validate new password
    if (!newPassword) {
      newErrors.newPassword = '새 비밀번호를 입력해주세요.';
    } else {
      const passwordError = validatePassword(newPassword);
      if (passwordError) {
        newErrors.newPassword = passwordError;
      }
    }

    // Validate confirm password
    if (!confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호 확인을 입력해주세요.';
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = '새 비밀번호가 일치하지 않습니다.';
    }

    // Check if new password is same as current
    if (currentPassword && newPassword && currentPassword === newPassword) {
      newErrors.newPassword = '현재 비밀번호와 다른 비밀번호를 입력해주세요.';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      // Success
      alert('비밀번호가 성공적으로 변경되었습니다.');
      onSave();
    }
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

        {/* Password Change Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-indigo-600" />
              <CardTitle>비밀번호 변경</CardTitle>
            </div>
            <CardDescription>
              새로운 비밀번호를 입력해주세요
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Current Password */}
            <div className="space-y-2">
              <Label htmlFor="current-password">현재 비밀번호</Label>
              <div className="relative">
                <Input
                  id="current-password"
                  type={showCurrentPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="현재 비밀번호를 입력하세요"
                  className={errors.currentPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showCurrentPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.currentPassword && (
                <p className="text-sm text-red-500">{errors.currentPassword}</p>
              )}
            </div>

            {/* New Password */}
            <div className="space-y-2">
              <Label htmlFor="new-password">새 비밀번호</Label>
              <div className="relative">
                <Input
                  id="new-password"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="새 비밀번호를 입력하세요"
                  className={errors.newPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.newPassword && (
                <p className="text-sm text-red-500">{errors.newPassword}</p>
              )}
              <p className="text-xs text-muted-foreground">
                영문, 숫자 포함 8자 이상
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <Label htmlFor="confirm-password">새 비밀번호 확인</Label>
              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="새 비밀번호를 다시 입력하세요"
                  className={errors.confirmPassword ? 'border-red-500' : ''}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Security Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">비밀번호 보안 팁</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• 8자 이상의 영문, 숫자, 특수문자를 조합하세요</li>
              <li>• 다른 사이트와 다른 비밀번호를 사용하세요</li>
              <li>• 개인정보(이름, 생년월일 등)를 포함하지 마세요</li>
              <li>• 정기적으로 비밀번호를 변경하세요</li>
            </ul>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2 pb-4">
          <Button onClick={handleSubmit} className="w-full">
            비밀번호 변경
          </Button>
          <Button onClick={onBack} variant="outline" className="w-full">
            취소
          </Button>
        </div>
      </div>
    </div>
  );
}