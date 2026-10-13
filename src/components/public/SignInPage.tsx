import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, ShieldCheck, Mail, Lock } from 'lucide-react';

export const SignInPage: React.FC = () => {
  const { signIn, setCurrentPage } = useApp();
  const [email, setEmail] = useState('sarah.jenkins@leadfit.ai');
  const [password, setPassword] = useState('••••••••••••');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please provide a valid corporate email address.');
      return;
    }
    setError('');
    signIn(email, 'Sarah Jenkins');
  };

  const handleDemoSignIn = () => {
    signIn('sarah.jenkins@leadfit.ai', 'Sarah Jenkins');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-10 h-10 rounded-xl bg-indigo-600 items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Sign In to LeadFit AI</h1>
          <p className="text-xs text-slate-500">Access your autonomous sales agents & signal workspace</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Work Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-semibold text-slate-700 dark:text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => alert('Password reset link sent to registered email.')}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Forgot?
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
          >
            Sign In
          </button>
        </form>

        <div className="relative flex py-1 items-center">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
          <span className="flex-shrink mx-3 text-[11px] text-slate-400">or fast access</span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800" />
        </div>

        <button
          onClick={handleDemoSignIn}
          className="w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <span>Open Instant Demo Workspace</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="text-center text-xs text-slate-500">
          Don't have an account?{' '}
          <button
            onClick={() => setCurrentPage('sign-up')}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Sign up for free
          </button>
        </div>
      </div>
    </div>
  );
};
