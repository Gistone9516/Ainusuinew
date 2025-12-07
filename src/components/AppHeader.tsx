import { Bell, User } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import type { UserData, Page } from '../App';

interface AppHeaderProps {
  userData: UserData;
  onNavigate: (page: Page) => void;
  title?: string;
  subtitle?: string;
}

export function AppHeader({ userData, onNavigate, title = 'Ainus', subtitle }: AppHeaderProps) {
  const unreadCount = 2; // Mock unread notifications count
  
  // subtitle이 없으면 사용자 이름을 기본값으로 사용
  const displaySubtitle = subtitle || (userData.username ? `안녕하세요, ${userData.username}님` : undefined);

  return (
    <div className="flex-shrink-0 flex items-center justify-between p-4 pt-6 pb-4 bg-white">
      <div className="flex-1">
        <h1 className="text-3xl mb-1" style={{ fontWeight: '800', letterSpacing: '-0.02em' }}>{title}</h1>
        {displaySubtitle && (
          <p className="text-sm text-muted-foreground">{displaySubtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {/* Notification Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="relative"
          onClick={() => onNavigate('notifications')}
        >
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>

        {/* Profile Button */}
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => onNavigate('mypage')}
        >
          <User className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
}