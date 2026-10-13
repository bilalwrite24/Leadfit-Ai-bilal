import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

export const Toast: React.FC = () => {
  const { toastMessage } = useApp();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />,
    error: <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />,
    info: <Info className="w-4 h-4 text-indigo-400 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-500/20 bg-slate-900/95 text-slate-100',
    error: 'border-rose-500/20 bg-slate-900/95 text-slate-100',
    info: 'border-indigo-500/20 bg-slate-900/95 text-slate-100',
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 transition-all duration-300 transform translate-y-0 opacity-100 pointer-events-none">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md text-xs font-medium ${
          borders[toastMessage.type]
        }`}
      >
        {icons[toastMessage.type]}
        <span>{toastMessage.text}</span>
      </div>
    </div>
  );
};
