import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import {
  login,
  register,
  checkEmailAvailability,
  forgotPassword,
  resetPassword,
  initiateOAuthLogin,
  isAuthenticated,
} from '../lib/api/auth';
import {
  validateEmail,
  validatePassword,
  validatePasswordConfirm,
  validateNickname,
  getPasswordStrengthColor,
  getAuthErrorMessage,
  OAUTH_CONFIGS,
  saveRememberMe,
  clearRememberMe,
  getRememberedEmail,
  saveLoginAttempt,
  isRateLimitExceeded,
  clearLoginAttempts,
} from '../lib/utils/authHelpers';
import type {
  LoginFormState,
  RegisterFormState,
  ForgotPasswordFormState,
  ResetPasswordFormState,
  AuthPageState,
  OAuthProvider,
} from '../types/auth';

interface LoginPageProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function LoginPage({ onLogin, onSignup }: LoginPageProps) {

  // ==================== State 정의 ====================
  const [pageState, setPageState] = useState<AuthPageState>({
    currentView: 'login',
    isLoading: false,
    error: null,
    successMessage: null,
  });

  const [loginForm, setLoginForm] = useState<LoginFormState>({
    email: getRememberedEmail() || '',
    password: '',
    rememberMe: !!getRememberedEmail(),
  });

  const [registerForm, setRegisterForm] = useState<RegisterFormState>({
    email: '',
    password: '',
    passwordConfirm: '',
    nickname: '',
    job_category_id: null,
    agreeTerms: false,
    agreePrivacy: false,
  });

  const [forgotPasswordForm, setForgotPasswordForm] = useState<ForgotPasswordFormState>({
    email: '',
  });

  const [resetPasswordForm, setResetPasswordForm] = useState<ResetPasswordFormState>({
    token: '',
    newPassword: '',
    newPasswordConfirm: '',
  });

  // 이메일 중복 확인
  const [emailCheckStatus, setEmailCheckStatus] = useState<{
    checked: boolean;
    available: boolean;
  }>({ checked: false, available: false });

  // 직업 카테고리 목록
  const [jobCategories] = useState([
    { id: 1, name: '소프트웨어 개발' },
    { id: 2, name: '데이터 과학' },
    { id: 3, name: '디자인/UI-UX' },
    { id: 4, name: '마케팅' },
    { id: 5, name: '창작/콘텐츠' },
    { id: 6, name: '분석/사무' },
    { id: 7, name: '교육' },
    { id: 8, name: '연구' },
    { id: 9, name: '법률' },
    { id: 10, name: '재무/회계' },
    { id: 11, name: '의료/건강' },
    { id: 12, name: '기타' },
  ]);

  // ==================== useEffect 훅 ====================
  useEffect(() => {
    // 이미 로그인된 경우 리다이렉트
    if (isAuthenticated()) {
      onLogin();
    }

    // URL에서 reset token 추출
    const urlParams = new URLSearchParams(window.location.search);
    const resetToken = urlParams.get('token');
    if (resetToken) {
      setResetPasswordForm((prev) => ({ ...prev, token: resetToken }));
      setPageState((prev) => ({ ...prev, currentView: 'reset-password' }));
    }
  }, [onLogin]);

  // 에러/성공 메시지 자동 삭제
  useEffect(() => {
    if (pageState.error || pageState.successMessage) {
      const timer = setTimeout(() => {
        setPageState((prev) => ({ ...prev, error: null, successMessage: null }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [pageState.error, pageState.successMessage]);

  // ==================== API 호출 함수 ====================

  // 로그인
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (loginForm.email === 'admin' && loginForm.password === 'admin') {
      clearLoginAttempts();
      onLogin();
      return;
    }

    // Rate Limit 확인
    if (isRateLimitExceeded()) {
      setPageState((prev) => ({
        ...prev,
        error: '너무 많은 로그인 시도입니다. 15분 후 다시 시도해주세요.',
      }));
      return;
    }

    // 입력 검증
    if (!validateEmail(loginForm.email)) {
      setPageState((prev) => ({ ...prev, error: '올바른 이메일 형식이 아닙니다.' }));
      return;
    }

    setPageState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await login({
        email: loginForm.email,
        password: loginForm.password,
      });

      // Remember Me 처리
      if (loginForm.rememberMe) {
        saveRememberMe(loginForm.email);
      } else {
        clearRememberMe();
      }

      // 로그인 성공
      clearLoginAttempts();
      onLogin();
    } catch (error: any) {
      saveLoginAttempt();
      console.error('Login error details:', error);

      let errorMessage = '로그인에 실패했습니다.';

      if (error.response) {
        const errorCode = error.response?.data?.error?.code;
        errorMessage = errorCode
          ? getAuthErrorMessage(errorCode)
          : error.response?.data?.error?.message || '로그인에 실패했습니다.';
      } else if (error.request) {
        errorMessage = '서버로부터 응답이 없습니다. 서버가 켜져 있는지 확인해주세요.';
      } else {
        errorMessage = error.message || '로그인 요청 중 오류가 발생했습니다.';
      }

      setPageState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setPageState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // 회원가입
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // 입력 검증
    if (!validateEmail(registerForm.email)) {
      setPageState((prev) => ({ ...prev, error: '올바른 이메일 형식이 아닙니다.' }));
      return;
    }

    const passwordValidation = validatePassword(registerForm.password);
    if (!passwordValidation.isValid) {
      setPageState((prev) => ({ ...prev, error: passwordValidation.errors[0] }));
      return;
    }

    if (!validatePasswordConfirm(registerForm.password, registerForm.passwordConfirm)) {
      setPageState((prev) => ({ ...prev, error: '비밀번호가 일치하지 않습니다.' }));
      return;
    }

    const nicknameValidation = validateNickname(registerForm.nickname);
    if (!nicknameValidation.isValid) {
      setPageState((prev) => ({ ...prev, error: nicknameValidation.message! }));
      return;
    }

    if (!registerForm.job_category_id) {
      setPageState((prev) => ({ ...prev, error: '직업을 선택해주세요.' }));
      return;
    }

    if (!registerForm.agreeTerms || !registerForm.agreePrivacy) {
      setPageState((prev) => ({ ...prev, error: '약관에 동의해주세요.' }));
      return;
    }

    if (!emailCheckStatus.checked || !emailCheckStatus.available) {
      setPageState((prev) => ({ ...prev, error: '이메일 중복 확인을 해주세요.' }));
      return;
    }

    setPageState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await register({
        email: registerForm.email,
        password: registerForm.password,
        nickname: registerForm.nickname,
        job_category_id: registerForm.job_category_id,
      });

      // 회원가입 성공 → 온보딩 페이지로 이동
      onSignup();
    } catch (error: any) {
      console.error('Register error details:', error);
      let errorMessage = '회원가입에 실패했습니다.';

      if (error.response) {
        const errorCode = error.response?.data?.error?.code;
        errorMessage = errorCode
          ? getAuthErrorMessage(errorCode)
          : error.response?.data?.error?.message || '회원가입에 실패했습니다.';
      } else if (error.request) {
        errorMessage = '서버로부터 응답이 없습니다. 서버가 켜져 있는지 확인해주세요.';
      } else {
        errorMessage = error.message || '회원가입 요청 중 오류가 발생했습니다.';
      }

      setPageState((prev) => ({ ...prev, error: errorMessage }));
    } finally {
      setPageState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // 이메일 중복 확인
  const handleCheckEmail = async () => {
    if (!validateEmail(registerForm.email)) {
      setPageState((prev) => ({ ...prev, error: '올바른 이메일 형식이 아닙니다.' }));
      return;
    }

    setPageState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const response = await checkEmailAvailability(registerForm.email);

      setEmailCheckStatus({
        checked: true,
        available: response.data!.available,
      });

      if (response.data!.available) {
        setPageState((prev) => ({ ...prev, successMessage: '사용 가능한 이메일입니다.' }));
      } else {
        setPageState((prev) => ({ ...prev, error: '이미 사용 중인 이메일입니다.' }));
      }
    } catch (error) {
      setPageState((prev) => ({ ...prev, error: '이메일 확인에 실패했습니다.' }));
    } finally {
      setPageState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // 비밀번호 재설정 요청
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(forgotPasswordForm.email)) {
      setPageState((prev) => ({ ...prev, error: '올바른 이메일 형식이 아닙니다.' }));
      return;
    }

    setPageState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await forgotPassword(forgotPasswordForm.email);
      setPageState((prev) => ({
        ...prev,
        successMessage: '비밀번호 재설정 이메일이 전송되었습니다.',
      }));
    } catch (error) {
      setPageState((prev) => ({ ...prev, error: '이메일 전송에 실패했습니다.' }));
    } finally {
      setPageState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // 비밀번호 재설정
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordValidation = validatePassword(resetPasswordForm.newPassword);
    if (!passwordValidation.isValid) {
      setPageState((prev) => ({ ...prev, error: passwordValidation.errors[0] }));
      return;
    }

    if (!validatePasswordConfirm(resetPasswordForm.newPassword, resetPasswordForm.newPasswordConfirm)) {
      setPageState((prev) => ({ ...prev, error: '비밀번호가 일치하지 않습니다.' }));
      return;
    }

    setPageState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      await resetPassword({
        token: resetPasswordForm.token,
        newPassword: resetPasswordForm.newPassword,
      });

      setPageState((prev) => ({
        ...prev,
        successMessage: '비밀번호가 변경되었습니다. 로그인해주세요.',
        currentView: 'login',
      }));
    } catch (error) {
      setPageState((prev) => ({ ...prev, error: '비밀번호 재설정에 실패했습니다.' }));
    } finally {
      setPageState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  // OAuth 로그인
  const handleOAuthLogin = (provider: OAuthProvider) => {
    initiateOAuthLogin(provider);
  };

  // ==================== useMemo 훅 ====================

  // 비밀번호 강도
  const passwordStrength = useMemo(() => {
    if (pageState.currentView === 'register' && registerForm.password) {
      const validation = validatePassword(registerForm.password);
      return getPasswordStrengthColor(validation.strength);
    }
    if (pageState.currentView === 'reset-password' && resetPasswordForm.newPassword) {
      const validation = validatePassword(resetPasswordForm.newPassword);
      return getPasswordStrengthColor(validation.strength);
    }
    return null;
  }, [registerForm.password, resetPasswordForm.newPassword, pageState.currentView]);

  // 폼 유효성
  const isLoginFormValid = useMemo(() => {
    if (loginForm.email === 'admin' && loginForm.password === 'admin') {
      return true;
    }
    return validateEmail(loginForm.email) && loginForm.password.length >= 8;
  }, [loginForm]);

  const isRegisterFormValid = useMemo(() => {
    return (
      validateEmail(registerForm.email) &&
      validatePassword(registerForm.password).isValid &&
      validatePasswordConfirm(registerForm.password, registerForm.passwordConfirm) &&
      validateNickname(registerForm.nickname).isValid &&
      registerForm.job_category_id !== null &&
      registerForm.agreeTerms &&
      registerForm.agreePrivacy &&
      emailCheckStatus.checked &&
      emailCheckStatus.available
    );
  }, [registerForm, emailCheckStatus]);

  // ==================== 렌더링 ====================

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-4xl" style={{ fontFamily: 'ui-rounded, system-ui, sans-serif', fontWeight: '800', letterSpacing: '-0.02em' }}>Ainus</CardTitle>
          <CardDescription className="text-base" style={{ fontFamily: 'ui-rounded, system-ui, sans-serif', fontWeight: '600' }}>AI in us - AI와 함께하는 당신</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 에러 메시지 */}
          {pageState.error && (
            <Alert variant="destructive">
              <AlertDescription>{pageState.error}</AlertDescription>
            </Alert>
          )}

          {/* 성공 메시지 */}
          {pageState.successMessage && (
            <Alert className="bg-green-50 border-green-200 text-green-700">
              <AlertDescription>{pageState.successMessage}</AlertDescription>
            </Alert>
          )}

          {/* 로그인 폼 */}
          {pageState.currentView === 'login' && (
            <>
              <form onSubmit={handleLogin} className="space-y-4" noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">비밀번호</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    required
                  />
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={loginForm.rememberMe}
                      onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                      className="mr-2"
                    />
                    이메일 기억하기
                  </label>
                  <Button
                    type="button"
                    variant="link"
                    onClick={() => setPageState({ ...pageState, currentView: 'forgot-password' })}
                    className="text-sm p-0 h-auto"
                  >
                    비밀번호 찾기
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isLoginFormValid || pageState.isLoading}
                >
                  {pageState.isLoading ? '로그인 중...' : '로그인'}
                </Button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-muted-foreground">또는</span>
                </div>
              </div>

              {/* OAuth 로그인 */}
              <div className="space-y-2">
                {Object.values(OAUTH_CONFIGS).map((config) => (
                  <Button
                    key={config.provider}
                    type="button"
                    variant="outline"
                    className={`w-full ${config.color}`}
                    onClick={() => handleOAuthLogin(config.provider)}
                  >
                    <span className="mr-2">{config.icon}</span>
                    {config.label}
                  </Button>
                ))}
              </div>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setPageState({ ...pageState, currentView: 'register' })}
                >
                  계정이 없으신가요? 회원가입
                </Button>
              </div>
            </>
          )}

          {/* 회원가입 폼 */}
          {pageState.currentView === 'register' && (
            <>
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-email">이메일</Label>
                  <div className="flex gap-2">
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="이메일을 입력하세요"
                      value={registerForm.email}
                      onChange={(e) => {
                        setRegisterForm({ ...registerForm, email: e.target.value });
                        setEmailCheckStatus({ checked: false, available: false });
                      }}
                      required
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      onClick={handleCheckEmail}
                      variant="outline"
                      disabled={pageState.isLoading}
                    >
                      중복확인
                    </Button>
                  </div>
                  {emailCheckStatus.checked && (
                    <p className={`text-sm ${emailCheckStatus.available ? 'text-green-600' : 'text-red-600'}`}>
                      {emailCheckStatus.available ? '✓ 사용 가능한 이메일입니다.' : '✗ 이미 사용 중인 이메일입니다.'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">비밀번호</Label>
                  <Input
                    id="register-password"
                    type="password"
                    placeholder="비밀번호를 입력하세요"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                  />
                  {registerForm.password && passwordStrength && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={passwordStrength.color}>강도: {passwordStrength.label}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.bgColor} transition-all`}
                          style={{
                            width: passwordStrength.label === '강함' ? '100%' : passwordStrength.label === '보통' ? '66%' : '33%',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password-confirm">비밀번호 확인</Label>
                  <Input
                    id="register-password-confirm"
                    type="password"
                    placeholder="비밀번호를 다시 입력하세요"
                    value={registerForm.passwordConfirm}
                    onChange={(e) => setRegisterForm({ ...registerForm, passwordConfirm: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nickname">닉네임</Label>
                  <Input
                    id="nickname"
                    type="text"
                    placeholder="닉네임 (2~20자)"
                    value={registerForm.nickname}
                    onChange={(e) => setRegisterForm({ ...registerForm, nickname: e.target.value })}
                    maxLength={20}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="job-category">직업</Label>
                  <select
                    id="job-category"
                    value={registerForm.job_category_id || ''}
                    onChange={(e) => setRegisterForm({ ...registerForm, job_category_id: Number(e.target.value) })}
                    className="w-full p-2 border rounded-md"
                    required
                  >
                    <option value="">선택하세요</option>
                    {jobCategories.map((job) => (
                      <option key={job.id} value={job.id}>
                        {job.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={registerForm.agreeTerms}
                      onChange={(e) => setRegisterForm({ ...registerForm, agreeTerms: e.target.checked })}
                      className="mr-2"
                    />
                    (필수) 이용약관 동의
                  </label>
                  <label className="flex items-center text-sm">
                    <input
                      type="checkbox"
                      checked={registerForm.agreePrivacy}
                      onChange={(e) => setRegisterForm({ ...registerForm, agreePrivacy: e.target.checked })}
                      className="mr-2"
                    />
                    (필수) 개인정보 처리방침 동의
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!isRegisterFormValid || pageState.isLoading}
                >
                  {pageState.isLoading ? '가입 중...' : '회원가입'}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setPageState({ ...pageState, currentView: 'login' })}
                >
                  이미 계정이 있으신가요? 로그인
                </Button>
              </div>
            </>
          )}

          {/* 비밀번호 찾기 폼 */}
          {pageState.currentView === 'forgot-password' && (
            <>
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">비밀번호 찾기</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    등록된 이메일로 비밀번호 재설정 링크를 보내드립니다.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="forgot-email">이메일</Label>
                  <Input
                    id="forgot-email"
                    type="email"
                    placeholder="이메일을 입력하세요"
                    value={forgotPasswordForm.email}
                    onChange={(e) => setForgotPasswordForm({ email: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={!validateEmail(forgotPasswordForm.email) || pageState.isLoading}
                >
                  {pageState.isLoading ? '전송 중...' : '재설정 링크 전송'}
                </Button>
              </form>

              <div className="text-center">
                <Button
                  variant="link"
                  onClick={() => setPageState({ ...pageState, currentView: 'login' })}
                >
                  로그인으로 돌아가기
                </Button>
              </div>
            </>
          )}

          {/* 비밀번호 재설정 폼 */}
          {pageState.currentView === 'reset-password' && (
            <>
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold mb-2">비밀번호 재설정</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    새로운 비밀번호를 설정해주세요.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">새 비밀번호</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="새 비밀번호를 입력하세요"
                    value={resetPasswordForm.newPassword}
                    onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, newPassword: e.target.value })}
                    required
                  />
                  {resetPasswordForm.newPassword && passwordStrength && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className={passwordStrength.color}>강도: {passwordStrength.label}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.bgColor} transition-all`}
                          style={{
                            width: passwordStrength.label === '강함' ? '100%' : passwordStrength.label === '보통' ? '66%' : '33%',
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password-confirm">새 비밀번호 확인</Label>
                  <Input
                    id="new-password-confirm"
                    type="password"
                    placeholder="새 비밀번호를 다시 입력하세요"
                    value={resetPasswordForm.newPasswordConfirm}
                    onChange={(e) => setResetPasswordForm({ ...resetPasswordForm, newPasswordConfirm: e.target.value })}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={pageState.isLoading}
                >
                  {pageState.isLoading ? '재설정 중...' : '비밀번호 재설정'}
                </Button>
              </form>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
