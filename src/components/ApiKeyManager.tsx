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
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/80">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Key className="w-5 h-5 text-blue-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-800">YouTube API Key</h2>
      </div>

      {!isStored ? (
        <div className="space-y-4">
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Enter your YouTube API key"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 pr-12"
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
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {isLoading ? 'Saving...' : 'Save API Key'}
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-yellow-500 opacity-50 rounded-full"></div>
            <span className="text-gray-600">API key is configured</span>
          </div>
          <button
            onClick={handleClear}
            className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
};