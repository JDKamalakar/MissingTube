import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff } from 'lucide-react';
import { encryptApiKey, decryptApiKey } from '../utils/youtube';
import { saveApiKey, getApiKey, clearApiKey } from '../utils/storage';

interface ApiKeyManagerProps {
  onApiKeyChange: (apiKey: string) => void;
}

export const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyChange }) => {
  const [apiKey, setApiKey] = useState('');
  const [isStored, setIsStored] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // New state to control modal visibility

  useEffect(() => {
    const stored = getApiKey();
    if (stored) {
      setIsStored(true);
      const decrypted = decryptApiKey(stored);
      onApiKeyChange(decrypted);
    }
  }, [onApiKeyChange]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      alert('Please enter a valid API key');
      return;
    }

    setIsLoading(true);
    try {
      const encrypted = encryptApiKey(apiKey);
      saveApiKey(encrypted);
      setIsStored(true);
      onApiKeyChange(apiKey);
      setApiKey('');
      alert('API Key Saved Successfully!');
      setIsModalOpen(false); // Close modal on successful save
    } catch (error) {
      alert('Failed to Save API Key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    if (confirm('Are You Sure You Want to Clear the API Key?')) {
      clearApiKey();
      setIsStored(false);
      onApiKeyChange('');
      alert('API Key Cleared Successfully!');
      setIsModalOpen(false); // Close modal on clear
    }
  };

  // Function to open the API key manager modal
  const openApiKeyManager = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
  };

  // Function to close the API key manager modal
  const closeApiKeyManager = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset'; // Re-enable scrolling
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        closeApiKeyManager();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isModalOpen]);


  return (
    <>
      {/* Button to open the API Key Manager - you might integrate this elsewhere in your app */}
      {!isStored && (
        <button
          onClick={openApiKeyManager}
          className="py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
        >
          Manage API Key
        </button>
      )}

      {isStored && (
        <div className="flex items-center justify-between bg-white/80 backdrop-blur-lg rounded-2xl p-4 shadow-lg border border-white/80 animate-fade-in">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 opacity-75 rounded-full"></div>
            <span className="text-gray-600 text-sm">API key is configured</span>
          </div>
          <button
            onClick={openApiKeyManager} // Open modal to manage (clear)
            className="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200 text-sm"
          >
            Manage
          </button>
        </div>
      )}


      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop with transparency and blur */}
          <div
            className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-225 ease-out animate-fade-in"
            onClick={closeApiKeyManager}
          />

          {/* Main Modal Container */}
          <div
            className="relative bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-300/30 dark:border-gray-700/30 w-full max-w-lg animate-modal-enter elevation-3 p-6"
            role="dialog"
            aria-modal="true"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4 sticky top-0 bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl z-10 rounded-t-2xl -mx-6 pt-6 px-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl border border-gray-300/30 dark:border-gray-700/30 shadow-md transition-all duration-300 hover:scale-110 active:scale-95 hover:shadow-lg">
                  <Key className="w-6 h-6 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">YouTube API Key</h2>
              </div>
              <button
                onClick={closeApiKeyManager}
                className="p-3 bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl shadow-md transition-all duration-300 hover:scale-110 active:scale-95 text-gray-600 hover:text-red-600 border border-gray-300/30 dark:border-gray-700/30 hover:shadow-lg"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <hr className="border-t border-gray-300/30 dark:border-gray-700/30 my-4 -mx-6" /> {/* Separator */}

            {/* Content */}
            {!isStored ? (
              <div className="space-y-4">
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your YouTube API key"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12 bg-white/50 dark:bg-gray-700/50 text-gray-800 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <button
                  onClick={handleSave}
                  disabled={isLoading || !apiKey.trim()}
                  className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {isLoading ? 'Saving...' : 'Save API Key'}
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center text-center py-4">
                <div className="p-4 bg-green-100/50 dark:bg-green-800/50 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center shadow-md">
                  <Key className="w-8 h-8 text-green-600 dark:text-green-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2">API Key Configured</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Your YouTube API key is securely stored and ready to use.
                </p>
                <button
                  onClick={handleClear}
                  className="px-6 py-3 text-red-600 bg-red-100/50 dark:bg-red-800/50 rounded-xl font-medium hover:bg-red-200/70 dark:hover:bg-red-700/70 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                >
                  Clear API Key
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};