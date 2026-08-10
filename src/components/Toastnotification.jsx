import { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

const Toast = ({ message, type = "success", onClose, duration = 3000 }) => {
  
  // Auto-dismiss the toast after the duration (3 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === "success";

  return (
    <div className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3.5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all duration-300 animate-slide-in ${
      isSuccess 
        ? "bg-emerald-950/40 border-emerald-500/30 text-emerald-200 shadow-emerald-500/5" 
        : "bg-rose-950/40 border-rose-500/30 text-rose-200 shadow-rose-500/5"
    }`}>
      {/* Dynamic Status Icon */}
      {isSuccess ? (
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
      ) : (
        <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
      )}

      {/* Message Content */}
      <div className="flex flex-col pr-2">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
          {isSuccess ? "Success" : "Error"}
        </h4>
        <p className="text-xs font-semibold mt-0.5">{message}</p>
      </div>

      {/* Manual Close Button */}
      <button 
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-slate-100 transition"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Toast;