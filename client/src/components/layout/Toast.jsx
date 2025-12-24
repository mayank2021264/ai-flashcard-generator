import React from 'react';
import { useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5" />,
    error: <XCircle className="w-5 h-5" />,
    warning: <AlertCircle className="w-5 h-5" />,
    info: <Info className="w-5 h-5" />
  };

  const styles = {
    success: 'bg-green-500/20 border-green-500/50 text-green-200',
    error: 'bg-red-500/20 border-red-500/50 text-red-200',
    warning: 'bg-yellow-500/20 border-yellow-500/50 text-yellow-200',
    info: 'bg-blue-500/20 border-blue-500/50 text-blue-200'
  };

  return (
    <div className="fixed top-4 right-4 z-100 animate-slide-in">
      <div className={`${styles[type]} backdrop-blur-lg border rounded-lg p-4 shadow-2xl flex items-center gap-3 min-w-[300px] max-w-md`}>
        {icons[type]}
        <p className="flex-1 font-medium">{message}</p>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/10 rounded transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default Toast;