import React from 'react';
import { useApp } from '../../context/AppContext';
import { Toast } from '../common/Toast';
import {
  Target,
  Sparkles,
  Moon,
  Sun,
  UserCheck,
  Search,
} from 'lucide-react';
import bilalExactPhoto from '../../assets/images/bilal_exact_photo.jpg';

export const AppLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentPage, setCurrentPage, prospects, isDarkMode, toggleDarkMode } = useApp();

  return (
    <div className={`min-h-screen flex flex-col ${isDarkMode ? 'dark bg-slate-950 text-slate-50' : 'bg-slate-50 text-slate-900'}`}>
      <Toast />

      {/* Main App Top Navigation Bar */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setCurrentPage('lead-finder')}
              className="flex items-center gap-2.5 text-left group transition-transform active:scale-95"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 dark:text-white text-base tracking-tight">
                    Lead Identifier
                  </span>
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
                    Pro
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
                  B2B Decision Maker Prospecting Tool
                </span>
              </div>
            </button>
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => setCurrentPage('lead-finder')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentPage !== 'developer'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Search className="w-4 h-4" />
              <span>Lead Identifier</span>
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  currentPage !== 'developer'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                }`}
              >
                {prospects.length}
              </span>
            </button>

            <button
              onClick={() => setCurrentPage('developer')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                currentPage === 'developer'
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <img
                src={bilalExactPhoto}
                alt="Bilal Iqbal"
                className="w-5 h-5 rounded-full object-cover border border-amber-400"
              />
              <span className="hidden sm:inline">Developer Profile</span>
              <span className="sm:hidden">Developer</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/20 text-amber-600 dark:text-amber-300 font-bold hidden md:inline">
                Bilal Iqbal
              </span>
            </button>
          </nav>

          {/* Utility Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-slate-50/70 dark:bg-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          {children}
        </div>
      </main>

      {/* Clean Minimal Tool Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-4 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Lead Identifier Tool</span>
            <span>• Precision B2B Prospecting & Contact Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentPage('developer')}
              className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium"
            >
              Developed by Bilal Iqbal
            </button>
            <span>•</span>
            <span>{prospects.length} Total Leads in Workspace</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
