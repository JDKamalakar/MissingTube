import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Trash2, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { ConfirmationModal } from './ConfirmationModal';
import { encryptApiKey, decryptApiKey } from '../utils/youtube';
import { saveApiKey, getApiKey, clearApiKey } from '../utils/storage';

interface ApiKeyModalProps {
  onClose: () => void;
  onApiKeyChange: (apiKey: string) => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ onClose, onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    const stored = getApiKey();
    if (stored) {
      setIsStored(true);
      const decrypted = decryptApiKey(stored);
      onApiKeyChange(decrypted);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [onApiKeyChange, onClose]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Please Enter A Valid API Key' });
      return;
    }

    setIsLoading(true);
    try {
      const encrypted = encryptApiKey(apiKey);
      saveApiKey(encrypted);
      setIsStored(true);
      onApiKeyChange(apiKey);
      setApiKey('');
      setMessage({ type: 'success', text: 'API Key Saved Successfully!' });
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed To Save API Key' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearConfirm = () => {
    clearApiKey();
    setIsStored(false);
    onApiKeyChange('');
    setMessage({ type: 'success', text: 'API Key Cleared Successfully!' });
    setShowConfirmClear(false);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop: Enhanced blur and transparency */}
        <div
          className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
          onClick={onClose}
        />

        {/* Modal Container: Enhanced transparency, blur, shadow, and depth */}
        <div
          className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-md animate-modal-enter elevation-3"
          role="dialog"
          aria-modal="true"
        >
          {/* Header: Sticky, transparent, blurred, with bottom border and subtle shadow */}
          <div className="flex items-center justify-between p-6 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl border-b border-gray-300/30 dark:border-gray-700/30 flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-3">
              {/* Modal Icon Container: Now with hover scale, shadow, and depth */}
              <div className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg">
                <Key className="w-6 h-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold text-on-surface">YouTube API Key</h2>
            </div>
            {/* Close Button: Same effect as ConfirmationModal's X button */}
            <button
              onClick={onClose}
              className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-[1.08] active:scale-95 hover:shadow-lg group"
              aria-label="Close modal"
            >
              {/* X icon in red, spins and scales on hover */}
              <X className="w-5 h-5 text-error transition-transform duration-200 group-hover:[transform:rotate(360deg)] group-hover:scale-110" />
            </button>
          </div>

          <div className="p-6">
            {!isStored ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your YouTube API key"
                    // Input field with transparency, blur, border, shadow, and hover scale
                    className="w-full px-4 py-3 rounded-2xl border border-gray-300/30 dark:border-gray-700/30 bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300 pr-12 text-on-surface placeholder:text-on-surface-variant shadow-lg hover:shadow-xl hover:scale-[1.08] active:scale-[0.98]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    // Eye icon button with transparent, blurred, shadowed hover effects and hover scale
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant p-2 rounded-full hover:bg-white/10 dark:hover:bg-gray-800/10 backdrop-blur-sm transition-all duration-300 hover:scale-[1.08] active:scale-[0.92] shadow-lg hover:shadow-xl"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                {/* How-to-get-key info card: Transparent, blurred, shadowed for depth and hover scale */}
                <div className="text-xs text-on-surface-variant bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm rounded-2xl p-3 shadow-lg border border-gray-300/30 dark:border-gray-700/30 transition-all duration-300 hover:shadow-xl hover:scale-[1.08]">
                  <p className="mb-1">
                    <strong>How to get your API key:</strong>
                  </p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Go to Google Cloud Console</li>
                    <li>Create a new project or select existing</li>
                    <li>Enable YouTube Data API v3</li>
                    <li>Create credentials (API key)</li>
                    <li>Copy and paste the key here</li>
                  </ol>
                </div>

                {/* Save Button: Primary color, with shadow, transparency, and hover scale */}
                <button
                  onClick={handleSave}
                  disabled={isLoading || !apiKey.trim()}
                  className="w-full py-3 bg-primary/80 dark:bg-primary-dark/80 backdrop-blur-sm text-on-primary rounded-2xl font-medium hover:bg-primary/90 dark:hover:bg-primary-dark/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.08] active:scale-[0.92] flex items-center justify-center gap-2 border border-primary/50 dark:border-primary-dark/50"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5" />
                      Save API Key
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {/* API Key Configured message card: Green/success color, with transparency, blur, shadow, and hover scale */}
                <div className="flex items-center justify-center gap-2 p-4 bg-emerald-100/80 dark:bg-emerald-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-500/50 dark:border-emerald-700/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.08]">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span className="text-emerald-800 dark:text-emerald-200 font-medium">API Key Is Configured</span>
                </div>

                {/* Clear API Key button: Now with bounce animation on Trash2 icon */}
                <button
                  onClick={() => setShowConfirmClear(true)}
                  // MODIFIED: Added shadow-lg, hover:shadow-xl, and elevation-3
                  className="w-full py-3 bg-error/80 dark:bg-error-dark/80 backdrop-blur-sm text-on-error rounded-2xl font-medium hover:bg-error/90 dark:hover:bg-error-dark/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.08] active:scale-[0.92] flex items-center justify-center gap-2 group border border-error/50 dark:border-error-dark/50 elevation-3"
                >
                  {/* Trash icon with bounce animation, scale, and stroke increase */}
                  <Trash2 className="w-5 h-5 transition-all duration-500 group-hover:animate-bounce-short-slow group-hover:scale-[1.1] group-hover:stroke-[2.5px]" />
                  Clear API Key
                </button>
              </div>
            )}

            {message && (
              <div className={`mt-4 p-3 rounded-2xl flex items-center gap-2 animate-fade-in backdrop-blur-sm shadow-lg border ${
                message.type === 'success'
                  ? 'bg-emerald-100/70 border-emerald-500 text-emerald-800 dark:bg-emerald-800/70 dark:border-emerald-700 dark:text-emerald-200'
                  : 'bg-error-container/70 border-error text-on-error-container'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <AlertTriangle className="w-4 h-4" />
                )}
                <span className="text-sm">{message.text}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmationModal
        isOpen={showConfirmClear}
        onClose={() => setShowConfirmClear(false)}
        onConfirm={handleClearConfirm}
        title="Clear API Key?"
        message="Are you sure you want to clear the API key? This action cannot be undone."
        confirmText="Clear"
        cancelText="Cancel"
        type="danger"
      />
    </>
  );
};