import React from 'react';
import { Home, TrendingUp, MessageSquare, Sparkles, User } from 'lucide-react';
import type { Page } from '../App';

interface BottomNavigationProps {
  currentPage: Page;
  onNavigate: (page: Page) => void;
}

export function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  const navItems = [
    { page: 'home' as Page, icon: Home, label: '홈' },
    { page: 'issue' as Page, icon: TrendingUp, label: '이슈 지수' },
    { page: 'community' as Page, icon: MessageSquare, label: '커뮤니티' },
    { page: 'model' as Page, icon: Sparkles, label: '모델 추천' },
    { page: 'mypage' as Page, icon: User, label: '마이페이지' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex justify-around items-center h-16">
        {navItems.map(({ page, icon: Icon, label }) => (
          <button
            key={page}
            onClick={() => onNavigate(page)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              currentPage === page
                ? 'text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Icon className="h-5 w-5 mb-1" />
            <span className="text-xs">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
