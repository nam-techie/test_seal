import React, { useState, FormEvent } from 'react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { TestFlowLogo } from '../components/icons/Icons';
import { loginWithEmail, registerWithEmail, getAuthErrorMessage } from '../services/auth';
import { AuthError } from 'firebase/auth';

type AuthMode = 'login' | 'signup';

const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<AuthMode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
      } else {
        await registerWithEmail(email, password);
      }
      // Authentication state sẽ được cập nhật tự động qua AuthContext
      // App sẽ tự động redirect
    } catch (err) {
      const authError = err as AuthError;
      setError(getAuthErrorMessage(authError));
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    setError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 bg-gradient-g2">
      <div className="absolute top-8 left-8">
        <TestFlowLogo />
      </div>
      <Card className="w-full max-w-md" glow={true}>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {mode === 'login' ? 'Đăng nhập' : 'Đăng ký'} TestFlow AI
          </h1>
          <p className="text-primary-muted">
            {mode === 'login'
              ? 'Bắt đầu hành trình kiểm thử AI của bạn.'
              : 'Tạo tài khoản mới để bắt đầu.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-primary mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-surface2 border border-surface2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-violet text-primary"
              placeholder="your.email@example.com"
              disabled={loading}
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-primary mb-2">
              Mật khẩu
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-3 bg-surface2 border border-surface2 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-violet text-primary"
              placeholder="••••••••"
              disabled={loading}
            />
            {mode === 'signup' && (
              <p className="text-xs text-primary-muted mt-1">
                Mật khẩu phải có ít nhất 6 ký tự
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={loading || !email || !password}
          >
            {loading
              ? 'Đang xử lý...'
              : mode === 'login'
              ? 'Đăng nhập'
              : 'Đăng ký'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={switchMode}
            className="text-sm text-primary-muted hover:text-primary transition-colors"
            disabled={loading}
          >
            {mode === 'login' ? (
              <>
                Chưa có tài khoản?{' '}
                <span className="font-semibold underline">Đăng ký ngay</span>
              </>
            ) : (
              <>
                Đã có tài khoản?{' '}
                <span className="font-semibold underline">Đăng nhập</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-primary-muted text-center mt-8">
          Bằng cách đăng nhập, bạn đồng ý với{' '}
          <a href="#" className="underline hover:text-primary">
            Điều khoản
          </a>{' '}
          &{' '}
          <a href="#" className="underline hover:text-primary">
            Chính sách bảo mật
          </a>
          .
        </p>
      </Card>
    </div>
  );
};

export default AuthPage;
