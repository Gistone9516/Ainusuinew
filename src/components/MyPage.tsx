import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { User, Settings, FileText, MessageSquare, Bell, ChevronRight, LogOut, UserX, Loader2 } from 'lucide-react';
import type { UserData, Page } from '../App';
import { getExtendedUser, getMyPostsCount, getMyCommentsCount, deleteAccount } from '@/lib/api/user';
import { logout } from '@/lib/api/auth';
import { formatJoinDate, getGenderLabel } from '@/lib/utils/userHelpers';
import type { ExtendedUser } from '@/types/user';

interface MyPageProps {
  userData: UserData;
  onLogout: () => void;
  onNavigate: (page: Page) => void;
}

export function MyPage({ userData, onLogout, onNavigate }: MyPageProps) {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [postsCount, setPostsCount] = useState<number>(0);
  const [commentsCount, setCommentsCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const userData = await getExtendedUser();
      setUser(userData);

      // 게시글/댓글 수 로드
      const [posts, comments] = await Promise.all([
        getMyPostsCount(userData.user_id),
        getMyCommentsCount(),
      ]);
      setPostsCount(posts);
      setCommentsCount(comments);
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      onLogout();
    } catch (error) {
      console.error('Logout failed:', error);
      onLogout(); // 에러가 나도 로그아웃 처리
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm('정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      await deleteAccount();
      alert('회원 탈퇴가 완료되었습니다.');
      onLogout();
    } catch (error) {
      console.error('Account deletion failed:', error);
      alert('회원 탈퇴에 실패했습니다. 나중에 다시 시도해주세요.');
    }
  };

  const menuItems = [
    {
      icon: User,
      title: '내 정보 확인 및 수정',
      description: '프로필, 직업, 관심 태그 수정',
      onClick: () => onNavigate('profile-edit'),
    },
    {
      icon: Settings,
      title: '앱 설정',
      description: '알림, 테마, 언어 설정',
      onClick: () => onNavigate('app-settings'),
    },
    {
      icon: FileText,
      title: '내 게시글',
      description: '작성한 게시글 확인',
      badge: postsCount > 0 ? postsCount.toString() : undefined,
      onClick: () => onNavigate('my-posts'),
    },
    {
      icon: MessageSquare,
      title: '내 댓글',
      description: '작성한 댓글 확인',
      badge: commentsCount > 0 ? commentsCount.toString() : undefined,
      onClick: () => onNavigate('my-comments'),
    },
    {
      icon: Bell,
      title: '알림 설정',
      description: '푸시 알림 관리',
      onClick: () => onNavigate('notification-settings'),
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen p-4 pb-20 bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 pb-20 bg-gray-50">
      <div className="max-w-4xl mx-auto space-y-4">
        {/* Header */}
        <div className="pt-4 pb-2">
          <h1 className="text-3xl mb-1" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>마이페이지</h1>
        </div>

        {/* Profile Card */}
        <Card className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl mb-1">{user?.nickname || '사용자'}</h2>
                <p className="text-indigo-100">{user?.email || 'user@example.com'}</p>
                <div className="flex gap-2 mt-2">
                  {user?.job_category_name && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {user.job_category_name}
                    </Badge>
                  )}
                  {user?.gender && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      {getGenderLabel(user.gender)}
                    </Badge>
                  )}
                  {user?.created_at && (
                    <Badge variant="secondary" className="bg-white/20 text-white border-0">
                      가입일: {formatJoinDate(user.created_at)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interest Tags */}
        {user?.interest_tags && user.interest_tags.length > 0 && (
          <Card>
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">관심 태그</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-2">
                {user.interest_tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Menu Items */}
        <Card>
          <CardContent className="p-0">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors border-b last:border-b-0"
              >
                <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                  <item.icon className="h-5 w-5 text-indigo-600" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge variant="destructive" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400" />
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-2">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            로그아웃
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start text-destructive hover:text-destructive"
            onClick={handleDeleteAccount}
          >
            <UserX className="h-5 w-5 mr-2" />
            회원 탈퇴
          </Button>
        </div>
      </div>
    </div>
  );
}