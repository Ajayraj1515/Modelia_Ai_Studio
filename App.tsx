
import React from 'react';
import { useAuth } from './hooks/useAuth';
import AuthPage from './components/AuthPage';
import StudioPage from './components/StudioPage';
import { LogoIcon } from './constants';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-brand-primary">
         <LogoIcon className="h-12 w-12 animate-pulse text-brand-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-primary">
      {user ? <StudioPage /> : <AuthPage />}
    </div>
  );
};

export default App;
