
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon, LogoutIcon } from '../constants';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-brand-secondary/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <div className="flex items-center space-x-3">
                    <LogoIcon className="h-8 w-8 text-brand-accent" />
                    <h1 className="text-xl font-bold text-brand-text">Modelia Studio</h1>
                </div>
                <div className="flex items-center space-x-4">
                    <span className="text-sm text-brand-text-secondary hidden sm:block">{user?.email}</span>
                    <button
                        onClick={logout}
                        aria-label="Logout"
                        className="p-2 rounded-full hover:bg-brand-secondary transition-colors duration-200"
                    >
                        <LogoutIcon className="h-6 w-6 text-brand-text-secondary" />
                    </button>
                </div>
            </div>
        </div>
      </header>
      <main className="flex-grow container mx-auto p-4 sm:p-6 lg:p-8">
        {children}
      </main>
    </div>
  );
};

export default Layout;
