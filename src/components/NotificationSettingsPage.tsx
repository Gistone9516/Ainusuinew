import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ChevronLeft, Bell, BellRing, MessageSquare } from 'lucide-react';
import {
  getNotificationSettings,
  saveNotificationSettings,
} from '@/lib/api/settings';

interface NotificationSettingsPageProps {
  onBack: () => void;
}

export function NotificationSettingsPage({ onBack }: NotificationSettingsPageProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [contentEnabled, setContentEnabled] = useState(true);
  const [communityEnabled, setCommunityEnabled] = useState(true);

  useEffect(() => {
    // 저장된 알림 설정 불러오기
    const settings = getNotificationSettings();
    setPushEnabled(settings.push);
    setContentEnabled(settings.content);
    setCommunityEnabled(settings.community);
  }, []);

  const handleSave = () => {
    saveNotificationSettings({
      push: pushEnabled,
      content: contentEnabled,
      community: communityEnabled,
    });
    alert('알림 설정이 저장되었습니다.');
    onBack();
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
          <h1 className="text-3xl mt-2 mb-1" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>알림 설정</h1>
          <p className="text-muted-foreground">받고 싶은 알림을 설정하세요</p>
        </div>

        {/* Push Notification Master Switch */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-indigo-600" />
              <CardTitle>푸시 알림</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="push-enabled" className="text-base">푸시 알림 허용</Label>
                <p className="text-sm text-muted-foreground">
                  모든 알림을 끄려면 해제하세요
                </p>
              </div>
              <Switch
                id="push-enabled"
                checked={pushEnabled}
                onCheckedChange={setPushEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BellRing className="h-5 w-5 text-indigo-600" />
              <CardTitle>콘텐츠 알림</CardTitle>
            </div>
            <CardDescription>AI 관련 정보 알림</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="content-enabled" className="text-base">콘텐츠 알림 허용</Label>
                <p className="text-sm text-muted-foreground">
                  AI 이슈, 새 모델, 관심 태그 뉴스 알림
                </p>
              </div>
              <Switch
                id="content-enabled"
                checked={contentEnabled}
                onCheckedChange={setContentEnabled}
                disabled={!pushEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Community Notifications */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
              <CardTitle>커뮤니티 알림</CardTitle>
            </div>
            <CardDescription>게시글 및 댓글 알림</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="community-enabled" className="text-base">커뮤니티 알림 허용</Label>
                <p className="text-sm text-muted-foreground">
                  댓글, 좋아요, 인기 게시글 알림
                </p>
              </div>
              <Switch
                id="community-enabled"
                checked={communityEnabled}
                onCheckedChange={setCommunityEnabled}
                disabled={!pushEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="pb-20">
          <Button onClick={handleSave} className="w-full">
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}