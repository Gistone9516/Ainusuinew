import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { User } from 'lucide-react';

interface OnboardingGenderProps {
  onNext: (gender: string) => void;
}

export function OnboardingGender({ onNext }: OnboardingGenderProps) {
  const [selectedGender, setSelectedGender] = useState('');

  const genders = [
    { value: 'male', label: '남성' },
    { value: 'female', label: '여성' },
    { value: 'other', label: '기타' },
    { value: 'prefer-not-to-say', label: '선택 안 함' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <User className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-2xl">성별을 선택해주세요</CardTitle>
          <CardDescription>맞춤 서비스 제공을 위해 필요합니다</CardDescription>
          <div className="text-sm text-muted-foreground mt-2">1/3 단계</div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {genders.map((gender) => (
              <button
                key={gender.value}
                onClick={() => setSelectedGender(gender.value)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedGender === gender.value
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {gender.label}
              </button>
            ))}
          </div>
          <Button
            onClick={() => selectedGender && onNext(selectedGender)}
            disabled={!selectedGender}
            className="w-full"
          >
            다음
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
