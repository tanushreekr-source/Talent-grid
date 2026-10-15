import React from 'react';
import { useWorkforce } from '../context/WorkforceContext';
import { CheckCircle2, AlertTriangle, Info, AlertCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notifications, dismissNotification } = useWorkforce();

  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none">
      {notifications.map((n) => {
        let icon = <Info className="w-4 h-4 text-cyan-400 shrink-0" />;
        let borderClass = 'border-cyan-500/30 bg-slate-900 text-slate-100';

        if (n.type === 'success') {
          icon = <CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" />;
          borderClass = 'border-teal-500/40 bg-slate-900 text-teal-100';
        } else if (n.type === 'warning') {
          icon = <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
          borderClass = 'border-amber-500/40 bg-slate-900 text-amber-100';
        } else if (n.type === 'error') {
          icon = <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
          borderClass = 'border-rose-500/40 bg-slate-900 text-rose-100';
        }

        return (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start justify-between gap-3 p-3 rounded-lg border shadow-lg text-xs transition-all animate-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              <span className="mt-0.5">{icon}</span>
              <p className="leading-snug">{n.message}</p>
            </div>
            <button
              onClick={() => dismissNotification(n.id)}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
