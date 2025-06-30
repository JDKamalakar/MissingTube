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
    if (confirmText.toLowerCase().includes('clear') || confirmText.toLowerCase().includes('delete')) {
      return <Trash2 className="w-4 h-4" />;
    }
    if (confirmText.toLowerCase().includes('refetch')) {
      return <RefreshCw className="w-4 h-4" />;
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop with navbar-like blur */}
      <div 
        className="fixed inset-0 bg-scrim/60 blur-subtle transition-opacity duration-225 ease-out animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal with navbar-like transparency */}
      <div 
        className="relative bg-surface/90 blur-light rounded-2xl shadow-2xl border border-outline-variant w-full max-w-md animate-modal-enter elevation-3"
        role="dialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className={`p-3 ${iconBg} rounded-2xl`}>
              <AlertTriangle className={`w-6 h-6 ${iconColor}`} />
            </div>
            <h2 className="text-xl font-semibold text-on-surface">{title}</h2>
          </div>

          <p className="text-on-surface-variant mb-6 leading-relaxed">{message}</p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-6 bg-surface-container text-on-surface rounded-2xl font-medium hover:bg-surface-container-high transition-all duration-225 hover:shadow-md hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              {cancelText}
            </button>
            <button
              onClick={handleConfirm}
              className={`flex-1 py-3 px-6 ${confirmButtonColor} rounded-2xl font-medium transition-all duration-225 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2`}
            >
              {getConfirmIcon()}
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};