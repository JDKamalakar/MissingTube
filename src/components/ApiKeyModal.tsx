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
          <div className="flex items-center justify-between p-6 border-b border-outline-variant">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-container rounded-2xl">
                <Key className="w-6 h-6 text-on-primary-container" />
              </div>
              <h2 className="text-xl font-semibold text-on-surface">YouTube API Key</h2>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-surface-container rounded-2xl transition-all duration-225 hover:scale-110 active:scale-95 text-on-surface-variant hover:text-on-surface"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
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
                    className="w-full px-4 py-3 rounded-2xl border border-outline-variant bg-surface-container/70 backdrop-blur-sm focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 pr-12 text-on-surface placeholder:text-on-surface-variant"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                
                <div className="text-xs text-on-surface-variant bg-surface-container/70 backdrop-blur-sm rounded-2xl p-3">
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

                <button
                  onClick={handleSave}
                  disabled={isLoading || !apiKey.trim()}
                  className="w-full py-3 bg-primary text-on-primary rounded-2xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
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
                <div className="flex items-center justify-center gap-2 p-4 bg-tertiary-container/70 backdrop-blur-sm rounded-2xl">
                  <div className="w-2 h-2 bg-tertiary rounded-full animate-pulse"></div>
                  <span className="text-on-tertiary-container font-medium">API Key Is Configured</span>
                </div>
                
                <button
                  onClick={() => setShowConfirmClear(true)}
                  className="w-full py-3 bg-error text-on-error rounded-2xl font-medium hover:bg-error/90 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.12] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-5 h-5" />
                  Clear API Key
                </button>
              </div>
            )}

            {message && (
              <div className={`mt-4 p-3 rounded-2xl flex items-center gap-2 animate-fade-in backdrop-blur-sm ${
                message.type === 'success' 
                  ? 'bg-tertiary-container/70 border border-tertiary text-on-tertiary-container' 
                  : 'bg-error-container/70 border border-error text-on-error-container'
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