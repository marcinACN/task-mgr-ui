import React, { useEffect } from 'react';

interface SnackbarProps {
  message: string;
  open: boolean;
  onClose: () => void;
  type?: 'error' | 'success' | 'info';
}

export const Snackbar: React.FC<SnackbarProps> = ({ message, open, onClose, type = 'error' }) => {
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      onClose();
    }, 10000);
    return () => clearTimeout(timer);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className={`fixed top-0 left-0 w-full flex justify-center z-[9999] pointer-events-none`}
      style={{ minHeight: '0', margin: 0 }}
    >
      <div
        className={`relative mt-4 min-w-[240px] max-w-xs px-4 py-3 rounded shadow-lg text-white text-center transition-all duration-300 flex items-center justify-center
        ${type === 'error' ? 'bg-red-600' : type === 'success' ? 'bg-green-600' : 'bg-blue-600'}`}
        role="alert"
        style={{ pointerEvents: 'auto' }}
      >
        <span className="flex-1 text-sm break-words select-text pr-6">{message}</span>
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-white text-lg font-bold px-2 py-0.5 rounded hover:bg-white/20 focus:outline-none"
          aria-label="Close notification"
          tabIndex={0}
          type="button"
        >
          ×
        </button>
      </div>
    </div>
  );
};
