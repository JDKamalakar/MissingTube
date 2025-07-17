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

  const panelShadowStyle = {
    boxShadow: isExpanded 
      ? '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' // Equivalent to shadow-2xl
      : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)', // Equivalent to shadow-xl
    transition: 'box-shadow 300ms ease-in-out', // Ensure smooth transition
  };

  return (
    // MODIFIED: Custom shadow style applied, hover:scale adjusted
    <div
      className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl border border-gray-300/30 dark:border-gray-700/30 elevation-2 animate-fade-in group hover:scale-[1.03] transition-all duration-300 ease-in-out"
      style={panelShadowStyle} // Apply custom shadow here
    >
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
        <div className="p-5 pt-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statItems.map((item, index) => {
              const Icon = item.icon;
              const colorClasses = getColorClasses(item.color);

              return (
                <div
                  key={index}
                  // MODIFIED: Adjusted padding and hover scale, added relative and z-10
                  className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-lg rounded-2xl p-6 text-center border border-gray-300/30 dark:border-gray-700/30 hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-225 hover:scale-[1.03] relative z-10" // scale reduced, relative & z-10 added
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
};