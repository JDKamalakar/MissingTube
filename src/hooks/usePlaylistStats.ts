import { useMemo } from 'react';
import { Video, PlaylistStats } from '../types';
import { parseDurationToSeconds, formatTotalDuration } from '../utils/youtube';

export const usePlaylistStats = (videos: Video[]): PlaylistStats => {
  return useMemo(() => {
    const totalVideos = videos.length;
    const availableVideos = videos.filter(v => !v.unavailable).length;
    const unavailableVideos = totalVideos - availableVideos;
    
    const totalSeconds = videos.reduce((acc, video) => {
      if (video.unavailable) return acc;
      return acc + parseDurationToSeconds(video.duration);
    }, 0);
    
    const averageSeconds = availableVideos > 0 ? Math.floor(totalSeconds / availableVideos) : 0;
    
    return {
      totalVideos,
      availableVideos,
      unavailableVideos,
      totalDuration: formatTotalDuration(totalSeconds),
      averageDuration: formatTotalDuration(averageSeconds),
    };
  }, [videos]);
};