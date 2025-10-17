
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon } from '../constants';
import Button from './Button';
import Spinner from './Spinner';
import Alert from './Alert';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login, signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-primary p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-brand-secondary rounded-xl shadow-2xl">
        <div className="text-center">
            <LogoIcon className="mx-auto h-12 w-auto text-brand-accent" />
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-brand-text">
                {isLogin ? 'Sign in to your account' : 'Create a new account'}
            </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <Alert type="error" message={error} />}
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Email address</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-700 bg-brand-primary px-3 py-2 text-brand-text placeholder-brand-text-secondary focus:z-10 focus:border-brand-accent focus:outline-none focus:ring-brand-accent sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-700 bg-brand-primary px-3 py-2 text-brand-text placeholder-brand-text-secondary focus:z-10 focus:border-brand-accent focus:outline-none focus:ring-brand-accent sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>
          
          <Button type="submit" fullWidth disabled={isLoading}>
            {isLoading && <Spinner small />}
            {isLogin ? 'Sign in' : 'Sign up'}
          </Button>

          <div className="text-sm text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="font-medium text-brand-accent hover:text-blue-400"
            >
              {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
