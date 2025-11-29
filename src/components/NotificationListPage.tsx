import React from 'react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Bell, ArrowLeft, MessageSquare, Heart, UserPlus, Newspaper } from 'lucide-react';

interface NotificationListPageProps {
  onBack: () => void;
}

interface Notification {
  id: string;
  type: 'comment' | 'like' | 'follow' | 'news';
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

export function NotificationListPage({ onBack }: NotificationListPageProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'news',
      title: 'AI 이슈 지수 급상승',
      message: '통합 AI 이슈 지수가 75점을 넘어 위험 단계에 진입했습니다.',
      time: '10분 전',
      isRead: false,
    },
    {
      id: '2',
      type: 'comment',
      title: '새 댓글',
      message: '회원님의 게시글에 댓글이 달렸습니다: "좋은 정보 감사합니다!"',
      time: '1시간 전',
      isRead: false,
    },
    {
      id: '3',
      type: 'like',
      title: '좋아요',
      message: '회원님의 게시글을 5명이 좋아합니다.',
      time: '2시간 전',
      isRead: true,
    },
    {
      id: '4',
      type: 'news',
      title: 'GPT-5 출시 소식',
      message: 'OpenAI의 GPT-5 개발 본격화 뉴스가 추가되었습니다.',
      time: '5시간 전',
      isRead: true,
    },
    {
      id: '5',
      type: 'follow',
      title: '새로운 팔로워',
      message: 'AI_Developer님이 회원님을 팔로우하기 시작했습니다.',
      time: '1일 전',
      isRead: true,
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'comment':
        return <MessageSquare className="h-5 w-5 text-blue-600" />;
      case 'like':
        return <Heart className="h-5 w-5 text-red-600" />;
      case 'follow':
        return <UserPlus className="h-5 w-5 text-green-600" />;
      case 'news':
        return <Newspaper className="h-5 w-5 text-indigo-600" />;
      default:
        return <Bell className="h-5 w-5 text-gray-600" />;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="flex items-center gap-3 p-4">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>알림</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">읽지 않은 알림 {unreadCount}개</p>
            )}
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm">
              모두 읽음
            </Button>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="p-4 space-y-2">
        {notifications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">알림이 없습니다</p>
            </CardContent>
          </Card>
        ) : (
          notifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer hover:border-indigo-300 transition-colors ${
                !notification.isRead ? 'bg-indigo-50/50 border-indigo-200' : ''
              }`}
            >
              <CardContent className="p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="font-medium">{notification.title}</h3>
                      {!notification.isRead && (
                        <Badge variant="default" className="flex-shrink-0 h-2 w-2 p-0 rounded-full bg-indigo-600" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}