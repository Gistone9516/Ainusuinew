import React from 'react';
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ChevronLeft, Settings, Palette, Globe, Moon } from 'lucide-react';

interface AppSettingsPageProps {
  onBack: () => void;
}

export function AppSettingsPage({ onBack }: AppSettingsPageProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [dataSync, setDataSync] = useState(true);
  const [language, setLanguage] = useState('ko');

  const languages = [
    { value: 'ko', label: '한국어' },
    { value: 'en', label: 'English' },
    { value: 'ja', label: '日本語' },
  ];

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Header */}
        <div className="pt-4 pb-2">
          <Button variant="ghost" className="w-fit -ml-2 mb-2" onClick={onBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            뒤로
          </Button>
          <h1 className="text-3xl mt-2 mb-1" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>앱 설정</h1>
          <p className="text-muted-foreground">앱 환경을 설정하세요</p>
        </div>

        {/* Display Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-indigo-600" />
              <CardTitle>화면 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="dark-mode" className="text-base">다크 모드</Label>
                <p className="text-sm text-muted-foreground">어두운 테마 사용</p>
              </div>
              <Switch
                id="dark-mode"
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        {/* Language Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-indigo-600" />
              <CardTitle>언어 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {languages.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => setLanguage(lang.value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    language === lang.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Settings */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-indigo-600" />
              <CardTitle>데이터 설정</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="auto-update" className="text-base">자동 업데이트</Label>
                <p className="text-sm text-muted-foreground">앱 자동 업데이트 허용</p>
              </div>
              <Switch
                id="auto-update"
                checked={autoUpdate}
                onCheckedChange={setAutoUpdate}
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="data-sync" className="text-base">데이터 동기화</Label>
                <p className="text-sm text-muted-foreground">클라우드 데이터 동기화</p>
              </div>
              <Switch
                id="data-sync"
                checked={dataSync}
                onCheckedChange={setDataSync}
              />
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>앱 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">버전</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">최종 업데이트</span>
              <span>2025-11-23</span>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2 pb-20">
          <Button variant="outline" className="w-full">
            캐시 삭제
          </Button>
          <Button variant="outline" className="w-full text-destructive hover:text-destructive">
            앱 데이터 초기화
          </Button>
        </div>
      </div>
    </div>
  );
}