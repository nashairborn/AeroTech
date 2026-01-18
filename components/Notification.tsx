import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

interface NotificationProps {
  message: string;
  type?: 'success' | 'info';
  onClose: () => void;
}

const Notification: React.FC<NotificationProps> = ({ message, type = 'info', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="glass-nav px-5 py-3 rounded-full flex items-center gap-3 shadow-2xl border border-white/10">
        {type === 'success' ? (
             <div className="bg-emerald-500/20 p-1 rounded-full">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
             </div>
        ) : (
             <div className="bg-sky-500/20 p-1 rounded-full">
                <AlertCircle className="w-4 h-4 text-sky-500" />
             </div>
        )}
        <span className="text-sm font-medium text-white tracking-wide">{message}</span>
      </div>
    </div>
  );
};

export default Notification;