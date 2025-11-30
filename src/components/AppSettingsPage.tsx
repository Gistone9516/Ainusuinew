import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ChevronLeft, Palette, Globe } from 'lucide-react';
import {
  getAppSettings,
  setTheme,
  setLanguage as saveLanguage,
  resetAppData,
} from '@/lib/api/settings';
import { LANGUAGE_OPTIONS } from '@/types/user';

interface AppSettingsPageProps {
  onBack: () => void;
}

export function AppSettingsPage({ onBack }: AppSettingsPageProps) {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'ko' | 'en' | 'ja'>('ko');

  useEffect(() => {
    // 저장된 설정 불러오기
    const settings = getAppSettings();
    setDarkMode(settings.theme === 'dark');
    setLanguage(settings.language);
  }, []);

  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    setTheme(checked ? 'dark' : 'light');
  };

  const handleLanguageChange = (lang: 'ko' | 'en' | 'ja') => {
    setLanguage(lang);
    saveLanguage(lang);
  };

  const handleResetAppData = () => {
    if (
      confirm(
        '앱 데이터를 초기화하시겠습니까?\n\n설정이 기본값으로 돌아가며, 토큰은 유지됩니다.'
      )
    ) {
      resetAppData();
      alert('앱 데이터가 초기화되었습니다.');
      // 설정 다시 불러오기
      const settings = getAppSettings();
      setDarkMode(settings.theme === 'dark');
      setLanguage(settings.language);
    }
  };

  const handleClearCache = () => {
    if (confirm('캐시를 삭제하시겠습니까?')) {
      // 캐시 삭제 로직 (현재는 localStorage의 userCache만 삭제)
      localStorage.removeItem('userCache');
      alert('캐시가 삭제되었습니다.');
    }
  };

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
                onCheckedChange={handleDarkModeChange}
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
              {LANGUAGE_OPTIONS.map((lang) => (
                <button
                  key={lang.value}
                  onClick={() => handleLanguageChange(lang.value)}
                  className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                    language === lang.value
                      ? 'border-indigo-600 bg-indigo-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{lang.flag}</span>
                  {lang.label}
                </button>
              ))}
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
          <Button variant="outline" className="w-full" onClick={handleClearCache}>
            캐시 삭제
          </Button>
          <Button variant="outline" className="w-full text-destructive hover:text-destructive" onClick={handleResetAppData}>
            앱 데이터 초기화
          </Button>
        </div>
      </div>
    </div>
  );
}