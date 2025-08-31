import React, { useEffect } from 'react';
import { AlertTriangle, X, Trash2, RefreshCw } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'warning' | 'danger';
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning'
}) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const iconColor = type === 'danger' ? 'text-error' : 'text-warning';
  const iconBg = type === 'danger' ? 'bg-error-container' : 'bg-warning-container';
  const confirmButtonColor = type === 'danger'
    ? 'bg-error hover:bg-error/90 text-on-error'
    : 'bg-tertiary-container hover:bg-tertiary-container/90 text-on-tertiary-container';

  const getConfirmIcon = () => {
    // Shared animation classes for confirm button icons
    const animationClasses = "transition-all duration-500 group-hover:animate-bounce-short-slow group-hover:scale-[1.1] group-hover:stroke-[2.5px]";

    if (confirmText.toLowerCase().includes('clear') || confirmText.toLowerCase().includes('delete')) {
      return <Trash2 className={`w-4 h-4 ${animationClasses}`} />;
    }
    if (confirmText.toLowerCase().includes('refetch') || confirmText.toLowerCase().includes('refresh')) {
      return <RefreshCw className={`w-4 h-4 ${animationClasses}`} />;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop: Enhanced with a darker, stronger blur and fade-in animation */}
      <div
        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Container: Transparent, blurred, with prominent shadow and depth */}
      <div
        className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-md animate-modal-enter elevation-3"
        role="dialog"
        aria-modal="true"
      >
        {/* Header: Sticky, transparent, blurred, with bottom border and subtle shadow */}
        <div className="flex items-center justify-between p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0 shadow-sm">
          <div className="flex items-center gap-3">
            {/* Alert Icon Container: Transparent, blurred, with shadow and hover scale */}
            <div className={`p-3 ${iconBg} rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg`}>
              <AlertTriangle className={`w-6 h-6 ${iconColor}`} />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">
              {title}
            </h2>
          </div>
          {/* X Close Button: With hover scale, shadow, and depth, and red X icon */}
          <button
            onClick={onClose}
            className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-1000 transition-transform duration-1000 group-hover:[transform:rotate(-360deg)] hover:scale-[1.08] active:scale-95 hover:shadow-lg group"
            aria-label="Close modal"
          >
            {/* X icon in red, spins and scales on hover */}
            <X className="w-5 h-5 text-error transition-transform duration-200 group-hover:rotate-90 group-hover:scale-110" />
          </button>
        </div>

        <div className="p-6">
          {/* Message in Data Card: Floating, with blur, transparency, shadow, and hover scale */}
          <div className="text-on-surface-variant bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-gray-300/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] mb-6 leading-relaxed">
            {message}
          </div>

          <div className="flex gap-3">
            {/* Cancel button: With transparency, shadow, depth, and hover effects including icon animation */}
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-surface-container/80 dark:bg-gray-700/80 backdrop-blur-sm text-on-surface rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.08] active:scale-[0.92] flex items-center justify-center gap-2 group border border-outline-variant/50 elevation-3" // ADDED shadow-lg hover:shadow-xl and elevation-3
            >
              <X className="w-4 h-4 text-error transition-transform duration-500 group-hover:rotate-[360deg] group-hover:scale-110" />
              {cancelText}
            </button>
            {/* Confirm button: With transparency, shadow, depth, and hover effects including icon animation */}
            <button
              onClick={handleConfirm}
              className={`flex-1 py-3 px-6 ${confirmButtonColor} rounded-2xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.08] active:scale-[0.92] flex items-center justify-center gap-2 group border border-outline-variant/50 elevation-3`} // ADDED shadow-lg hover:shadow-xl and elevation-3
            >
              {getConfirmIcon()} {/* Icon animation handled by getConfirmIcon */}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};