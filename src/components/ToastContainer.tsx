import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Award, Zap, Flame, Sparkles, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useAuth();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = Zap;
        let colorClasses = 'border-indigo-500/40 text-indigo-400 bg-slate-900/95';

        if (toast.type === 'level_up') {
          Icon = Sparkles;
          colorClasses = 'border-purple-500/50 text-purple-300 bg-slate-900/95';
        } else if (toast.type === 'achievement') {
          Icon = Award;
          colorClasses = 'border-amber-500/50 text-amber-300 bg-slate-900/95';
        } else if (toast.type === 'streak') {
          Icon = Flame;
          colorClasses = 'border-rose-500/50 text-rose-300 bg-slate-900/95';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-200 animate-slideInRight ${colorClasses}`}
          >
            <div className="p-2 rounded-lg bg-white/5 shrink-0">
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold text-white tracking-tight">{toast.title}</div>
              <div className="text-[11px] text-slate-300 mt-0.5 leading-snug">{toast.message}</div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
