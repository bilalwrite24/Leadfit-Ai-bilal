import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('LeadFit AI Runtime Error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('leadfit_prospects');
      localStorage.removeItem('leadfit_signals');
    } catch {
      // ignore
    }
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                Application Recovered
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                An unexpected interface state occurred. You can restore default state or reload the app below.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 text-left overflow-x-auto max-h-32">
                {this.state.error.message || String(this.state.error)}
              </div>
            )}

            <div className="flex items-center gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reload App</span>
              </button>
              <button
                onClick={this.handleReset}
                className="px-4 py-2.5 rounded-xl border border-slate-700 hover:border-slate-600 text-slate-300 text-xs font-semibold flex items-center gap-2 cursor-pointer transition-colors"
              >
                <Home className="w-3.5 h-3.5" />
                <span>Reset Cache</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
