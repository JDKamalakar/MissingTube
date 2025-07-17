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
    // MODIFIED: Adjusted shadow classes and transition for better rounded corners effect
    <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl shadow-xl hover:shadow-2xl border border-gray-300/30 dark:border-gray-700/30 elevation-2 animate-fade-in group hover:scale-[1.03] transition-all duration-300 ease-in-out">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        onMouseLeave={(e) => {
          e.currentTarget.blur();
        }}
        className="w-full p-6 flex items-center justify-between hover:bg-white/10 dark:hover:bg-gray-800/10 transition-all duration-225 state-layer focus:outline-none"
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-secondary-container rounded-2xl transition-transform duration-225 hover:scale-110">
            <BarChart3 className="w-6 h-6 text-on-secondary-container" />
          </div>
          <div className="text-left">
            <h3 className="text-xl font-semibold text-on-surface">Playlist Statistics</h3>
            <p className="text-on-surface-variant text-sm">View detailed analytics</p>
          </div>
        </div>
        <div className="flex-shrink-0 transition-transform duration-225">
          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-on-surface-variant" />
          ) : (
            <ChevronDown className="w-5 h-5 text-on-surface-variant" />
          )}
        </div>
      </button>

      <div className={`transition-all duration-500 ease-in-out transform-gpu ${isExpanded ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
        {/* MODIFIED: Adjusted padding to pt-1 to pt-2 or pt-3 to shift grid down slightly
                     And removed the top-padding from the containing div, added to each grid item instead. */}
        <div className="p-5"> {/* Changed pt-0 to p-5 to apply general padding */}
          {/* MODIFIED: Increased gap and adjusted padding */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statItems.map((item, index) => {
              const Icon = item.icon;
              const colorClasses = getColorClasses(item.color);

              return (
                <div
                  key={index}
                  // MODIFIED: Increased vertical padding further to p-6 (from p-5)
                  className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-gray-300/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-225 hover:scale-105"
                >
                  <div className={`inline-flex p-3 rounded-2xl mb-3 ${colorClasses} transition-transform duration-225 hover:scale-110`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="text-2xl font-bold text-on-surface mb-1 break-words">
                    {item.value}
                  </div>
                  <div className="text-sm text-on-surface-variant font-medium break-words">{item.label}</div>
                </div>
              );
            })}
          </div>

          {stats.unavailableVideos > 0 && (
            <div className="mt-6 p-4 bg-warning-container text-on-warning-container rounded-2xl border border-outline-variant transition-transform duration-225 hover:scale-[1.02]">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5" />
                <span className="text-sm font-medium break-words">
                  {stats.unavailableVideos} video{stats.unavailableVideos !== 1 ? 's' : ''} unavailable
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};1