import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BarChart3, Clock, Video, AlertTriangle } from 'lucide-react';
import { PlaylistStats } from '../types';

interface StatsPanelProps {
  stats: PlaylistStats;
}

export const StatsPanel: React.FC<StatsPanelProps> = ({ stats }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statItems = [
    {
      icon: Video,
      label: 'Total Videos',
      value: stats.totalVideos,
      color: 'primary',
    },
    {
      icon: BarChart3,
      label: 'Available',
      value: stats.availableVideos,
      color: 'tertiary',
    },
    {
      icon: AlertTriangle,
      label: 'Unavailable',
      value: stats.unavailableVideos,
      color: 'error',
    },
    {
      icon: Clock,
      label: 'Total Duration',
      value: stats.totalDuration,
      color: 'secondary',
    },
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      primary: 'bg-primary-container text-on-primary-container',
      secondary: 'bg-secondary-container text-on-secondary-container',
      tertiary: 'bg-tertiary-container text-on-tertiary-container',
      error: 'bg-error-container text-on-error-container',
    };
    return colorMap[color as keyof typeof colorMap] || colorMap.primary;
  };

  return (
    <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-xl border border-gray-300/30 dark:border-gray-700/30 overflow-hidden elevation-2 animate-fade-in">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseLeave={(e) => {
          // Force remove hover state when mouse leaves
          e.currentTarget.blur();
        }}
        className="w-full p-6 flex items-center justify-between hover:bg-white/10 dark:hover:bg-gray-800/10 transition-all duration-225 state-layer focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary-container rounded-2xl">
            <BarChart3 className="w-6 h-6 text-on-secondary-container" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-on-surface">Playlist Statistics</h3>
            <p className="text-on-surface-variant text-sm">View detailed analytics</p>
          </div>
        </div>
        <div className={`transition-transform duration-225 ${isExpanded ? 'rotate-180' : ''}`}>
          <ChevronDown className="w-5 h-5 text-on-surface-variant" />
        </div>
      </button>

      <div className={`transition-all duration-300 ease-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        <div className="p-6 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {statItems.map((item, index) => {
              const Icon = item.icon;
              const colorClasses = getColorClasses(item.color);

              return (
                <div
                  key={index}
                  className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-4 text-center border border-gray-300/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-225"
                >
                  <div className={`inline-flex p-3 rounded-2xl mb-3 ${colorClasses}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-on-surface mb-1">
                    {item.value}
                  </div>
                  <div className="text-sm text-on-surface-variant font-medium">{item.label}</div>
                </div>
              );
            })}
          </div>

          {stats.unavailableVideos > 0 && (
            <div className="mt-6 p-4 bg-warning-container text-on-warning-container rounded-2xl border border-outline-variant">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {stats.unavailableVideos} video{stats.unavailableVideos !== 1 ? 's' : ''} unavailable
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};