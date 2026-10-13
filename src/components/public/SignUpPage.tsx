import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight, Mail, Lock, User, Building } from 'lucide-react';

export const SignUpPage: React.FC = () => {
  const { signIn, setCurrentPage } = useApp();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !company) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    signIn(email, name);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex w-10 h-10 rounded-xl bg-indigo-600 items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <Sparkles className="w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Create Your LeadFit AI Account</h1>
          <p className="text-xs text-slate-500">14-day full access trial · No credit card required</p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sarah Jenkins"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

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
                placeholder="sarah@yourcompany.com"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Company Name
            </label>
            <div className="relative">
              <Building className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Nexus Technologies"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20 mt-2"
          >
            Create Free Workspace
          </button>
        </form>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <button
            onClick={() => setCurrentPage('sign-in')}
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline"
          >
            Sign in
          </button>
        </div>
      </div>
    </div>
  );
};
