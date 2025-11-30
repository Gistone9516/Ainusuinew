import { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { OnboardingGender } from './components/OnboardingGender';
import { OnboardingJob } from './components/OnboardingJob';
import { OnboardingTags } from './components/OnboardingTags';
import { HomePage } from './components/HomePage';
import { IssuePage } from './components/IssuePage';
import { IssueDetailPage } from './components/IssueDetailPage';
import { CommunityPage } from './components/CommunityPage';
import { CommunityPostDetailPage } from './components/CommunityPostDetailPage';
import { CommunityWritePage } from './components/CommunityWritePage';
import { ModelPage } from './components/ModelPage';
import { MyPage } from './components/MyPage';
import { ProfileEditPage } from './components/ProfileEditPage';
import { PasswordChangePage } from './components/PasswordChangePage';
import { AppSettingsPage } from './components/AppSettingsPage';
import { MyPostsPage } from './components/MyPostsPage';
import { MyCommentsPage } from './components/MyCommentsPage';
import { NotificationSettingsPage } from './components/NotificationSettingsPage';
import { NotificationListPage } from './components/NotificationListPage';
import { BottomNavigation } from './components/BottomNavigation';

export type Page = 'login' | 'signup' | 'onboarding-gender' | 'onboarding-job' | 'onboarding-tags' | 'home' | 'issue' | 'issue-detail' | 'community' | 'community-post-detail' | 'community-write' | 'model' | 'mypage' | 'profile-edit' | 'password-change' | 'app-settings' | 'my-posts' | 'my-comments' | 'notification-settings' | 'notifications';

export interface UserData {
  username?: string;
  email?: string;
  gender?: string;
  job?: string;
  tags?: string[];
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('login');
  const [userData, setUserData] = useState<UserData>({});
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [editingPostId, setEditingPostId] = useState<number | null>(null);
  const [selectedCluster, setSelectedCluster] = useState<any>(null);

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={() => setCurrentPage('onboarding-gender')} onSignup={() => setCurrentPage('signup')} />;
      case 'signup':
        return <SignupPage onSignup={(data) => {
          setUserData({ ...userData, ...data });
          setCurrentPage('onboarding-gender');
        }} onBack={() => setCurrentPage('login')} />;
      case 'onboarding-gender':
        return <OnboardingGender onNext={(gender) => {
          setUserData({ ...userData, gender });
          setCurrentPage('onboarding-job');
        }} />;
      case 'onboarding-job':
        return <OnboardingJob onNext={(job) => {
          setUserData({ ...userData, job });
          setCurrentPage('onboarding-tags');
        }} onBack={() => setCurrentPage('onboarding-gender')} />;
      case 'onboarding-tags':
        return <OnboardingTags userJob={userData.job || ''} onNext={(tags) => {
          setUserData({ ...userData, tags });
          setCurrentPage('home');
        }} onBack={() => setCurrentPage('onboarding-job')} />;
      case 'home':
        return <HomePage 
          userData={userData} 
          onNavigate={setCurrentPage}
          onSelectCluster={(cluster) => {
            setSelectedCluster(cluster);
            setCurrentPage('issue-detail');
          }}
        />;
      case 'issue':
        return <IssuePage 
          userData={userData} 
          onNavigate={setCurrentPage}
          onSelectCluster={(cluster) => {
            setSelectedCluster(cluster);
            setCurrentPage('issue-detail');
          }}
        />;
      case 'issue-detail':
        return <IssueDetailPage 
          cluster={selectedCluster}
          onNavigate={setCurrentPage}
          onBack={() => setCurrentPage('issue')}
        />;
      case 'community':
        return <CommunityPage 
          onNavigate={setCurrentPage} 
          onSelectPost={(postId) => {
            setSelectedPostId(postId);
            setCurrentPage('community-post-detail');
          }}
          onWrite={() => {
            setEditingPostId(null);
            setCurrentPage('community-write');
          }}
        />;
      case 'community-post-detail':
        return <CommunityPostDetailPage 
          postId={selectedPostId || 1}
          onNavigate={setCurrentPage}
          onBack={() => setCurrentPage('community')}
          onEdit={(postId) => {
            setEditingPostId(postId);
            setCurrentPage('community-write');
          }}
        />;
      case 'community-write':
        return <CommunityWritePage 
          postId={editingPostId || undefined}
          onBack={() => {
            if (editingPostId) {
              setCurrentPage('community-post-detail');
            } else {
              setCurrentPage('community');
            }
          }}
          onSave={() => {
            if (editingPostId) {
              setCurrentPage('community-post-detail');
            } else {
              setCurrentPage('community');
            }
            setEditingPostId(null);
          }}
        />;
      case 'model':
        return <ModelPage userData={userData} onNavigate={setCurrentPage} />;
      case 'mypage':
        return <MyPage 
          userData={userData} 
          onLogout={() => setCurrentPage('login')}
          onNavigate={setCurrentPage}
        />;
      case 'profile-edit':
        return <ProfileEditPage 
          userData={userData} 
          onSave={(data) => {
            setUserData({ ...userData, ...data });
            setCurrentPage('mypage');
          }}
          onBack={() => setCurrentPage('mypage')}
          onNavigate={setCurrentPage}
        />;
      case 'password-change':
        return <PasswordChangePage 
          onBack={() => setCurrentPage('profile-edit')}
          onSave={() => setCurrentPage('profile-edit')}
        />;
      case 'app-settings':
        return <AppSettingsPage onBack={() => setCurrentPage('mypage')} />;
      case 'my-posts':
        return <MyPostsPage onBack={() => setCurrentPage('mypage')} />;
      case 'my-comments':
        return <MyCommentsPage onBack={() => setCurrentPage('mypage')} />;
      case 'notification-settings':
        return <NotificationSettingsPage onBack={() => setCurrentPage('mypage')} />;
      case 'notifications':
        return <NotificationListPage onBack={() => setCurrentPage('home')} />;
      default:
        return <LoginPage onLogin={() => setCurrentPage('onboarding-gender')} onSignup={() => setCurrentPage('signup')} />;
    }
  };

  const showNavigation = ['home', 'issue', 'community', 'model', 'mypage'].includes(currentPage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${showNavigation ? 'pb-20' : ''}`}>
        {renderPage()}
      </div>
      {showNavigation && (
        <BottomNavigation currentPage={currentPage} onNavigate={setCurrentPage} />
      )}
    </div>
  );
}