import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { ChevronLeft, Bell, BellRing, MessageSquare, TrendingUp, Sparkles } from 'lucide-react';

interface NotificationSettingsPageProps {
  onBack: () => void;
}

export function NotificationSettingsPage({ onBack }: NotificationSettingsPageProps) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [issueAlerts, setIssueAlerts] = useState(true);
  const [communityAlerts, setCommunityAlerts] = useState(true);
  const [modelUpdates, setModelUpdates] = useState(true);
  const [newsAlerts, setNewsAlerts] = useState(true);
  const [commentAlerts, setCommentAlerts] = useState(true);
  const [likeAlerts, setLikeAlerts] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [vibrationEnabled, setVibrationEnabled] = useState(true);

  const issueThreshold = 70;

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
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-indigo-600" />
                  <Label htmlFor="issue-alerts" className="text-base">AI 이슈 지수 알림</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  이슈 지수가 {issueThreshold}점 이상일 때 알림
                </p>
              </div>
              <Switch
                id="issue-alerts"
                checked={issueAlerts}
                onCheckedChange={setIssueAlerts}
                disabled={!pushEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-indigo-600" />
                  <Label htmlFor="model-updates" className="text-base">새로운 모델 출시</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  새로운 AI 모델이 출시되면 알림
                </p>
              </div>
              <Switch
                id="model-updates"
                checked={modelUpdates}
                onCheckedChange={setModelUpdates}
                disabled={!pushEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <Bell className="h-4 w-4 text-indigo-600" />
                  <Label htmlFor="news-alerts" className="text-base">관심 태그 뉴스</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  관심 태그 관련 주요 뉴스 알림
                </p>
              </div>
              <Switch
                id="news-alerts"
                checked={newsAlerts}
                onCheckedChange={setNewsAlerts}
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
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="community-alerts" className="text-base">전체 커뮤니티 알림</Label>
                <p className="text-sm text-muted-foreground">
                  인기 게시글 및 이벤트 알림
                </p>
              </div>
              <Switch
                id="community-alerts"
                checked={communityAlerts}
                onCheckedChange={setCommunityAlerts}
                disabled={!pushEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="comment-alerts" className="text-base">댓글 알림</Label>
                <p className="text-sm text-muted-foreground">
                  내 게시글에 댓글이 달리면 알림
                </p>
              </div>
              <Switch
                id="comment-alerts"
                checked={commentAlerts}
                onCheckedChange={setCommentAlerts}
                disabled={!pushEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="like-alerts" className="text-base">좋아요 알림</Label>
                <p className="text-sm text-muted-foreground">
                  내 게시글/댓글에 좋아요가 달리면 알림
                </p>
              </div>
              <Switch
                id="like-alerts"
                checked={likeAlerts}
                onCheckedChange={setLikeAlerts}
                disabled={!pushEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Notification Style */}
        <Card>
          <CardHeader>
            <CardTitle>알림 방식</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="sound-enabled" className="text-base">알림음</Label>
                <p className="text-sm text-muted-foreground">
                  알림 시 소리 재생
                </p>
              </div>
              <Switch
                id="sound-enabled"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
                disabled={!pushEnabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="vibration-enabled" className="text-base">진동</Label>
                <p className="text-sm text-muted-foreground">
                  알림 시 진동
                </p>
              </div>
              <Switch
                id="vibration-enabled"
                checked={vibrationEnabled}
                onCheckedChange={setVibrationEnabled}
                disabled={!pushEnabled}
              />
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <div className="pb-20">
          <Button onClick={onBack} className="w-full">
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}