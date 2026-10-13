import React from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, User } from 'lucide-react';
import { NavigationTarget } from '../../types';

export const PublicHeader: React.FC = () => {
  const { currentPage, setCurrentPage, isAuthenticated } = useApp();

  const navLinks: { label: string; target: NavigationTarget }[] = [
    { label: 'Features', target: 'features' },
    { label: 'How It Works', target: 'how-it-works' },
    { label: 'Integrations', target: 'integrations-public' },
    { label: 'Pricing', target: 'pricing' },
    { label: 'Developer', target: 'developer' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setCurrentPage('landing')}
          className="flex items-center gap-2.5 text-slate-950 dark:text-white font-extrabold text-xl tracking-tight whitespace-nowrap shrink-0 hover:opacity-90 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <span>LeadFit AI</span>
        </button>

        {/* Zone 2: 4 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => {
            const isActive = currentPage === link.target;
            return (
              <button
                key={link.target}
                onClick={() => setCurrentPage(link.target)}
                className={`whitespace-nowrap shrink-0 transition-colors py-1 hover:text-indigo-600 dark:hover:text-indigo-400 ${
                  isActive
                    ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                    : ''
                }`}
              >
                {link.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {isAuthenticated ? (
            <button
              onClick={() => setCurrentPage('dashboard')}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/20 transition-colors whitespace-nowrap shrink-0"
            >
              <span>Go to App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage('sign-in')}
                className="px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors whitespace-nowrap shrink-0"
              >
                Sign In
              </button>
              <button
                onClick={() => setCurrentPage('sign-up')}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0"
              >
                <span>Start Free</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
