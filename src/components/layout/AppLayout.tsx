import React from 'react';
import { useApp } from '../../context/AppContext';
import { PublicHeader } from './PublicHeader';
import { PublicFooter } from './PublicFooter';
import { AppSidebar } from './AppSidebar';
import { AppTopBar } from './AppTopBar';
import { CommandPalette } from '../common/CommandPalette';
import { Toast } from '../common/Toast';
import { GeminiChatCopilot } from '../common/GeminiChatCopilot';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPage, isDarkMode } = useApp();

  const publicPages = [
    'landing',
    'features',
    'how-it-works',
    'integrations-public',
    'pricing',
    'sign-in',
    'sign-up',
    'privacy',
    'terms',
  ];

  const { isAuthenticated } = useApp();
  const isPublic =
    publicPages.includes(currentPage) ||
    (currentPage === 'developer' && !isAuthenticated);

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      <CommandPalette />
      <Toast />
      <GeminiChatCopilot />

      {isPublic ? (
        <div className="flex flex-col min-h-screen">
          <PublicHeader />
          <main className="flex-1">{children}</main>
          <PublicFooter />
        </div>
      ) : (
        <div className="flex h-screen overflow-hidden">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <AppTopBar />
            <main className="flex-1 overflow-y-auto bg-slate-50/70 dark:bg-slate-950 p-6 md:p-8">
              <div className="max-w-7xl mx-auto space-y-6">
                {children}
              </div>
            </main>
          </div>
        </div>
      )}
    </div>
  );
};
