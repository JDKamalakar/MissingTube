import { Video, PlaylistInfo } from '../types';

export const formatDuration = (duration: string): string => {
  if (duration === 'Unavailable') return 'Unavailable';
  
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 'Unavailable';
  
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
};

export const parseDurationToSeconds = (duration: string): number => {
  if (duration === 'Unavailable') return 0;
  
  const parts = duration.split(':').map(Number);
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

export const formatTotalDuration = (totalSeconds: number): string => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  }
  return `${seconds}s`;
};

export const extractPlaylistId = (url: string): string => {
  try {
    const urlObj = new URL(url);
    const playlistId = urlObj.searchParams.get('list');
    return playlistId || url;
  } catch {
    return url;
  }
};

export const getVideoUrl = (videoId: string): string => {
  return `https://www.youtube.com/watch?v=${videoId}`;
};

export const encryptApiKey = (key: string): string => {
  let encrypted = '';
  for (let i = 0; i < key.length; i++) {
    encrypted += String.fromCharCode(key.charCodeAt(i) ^ 137);
  }
  return encrypted;
};

export const decryptApiKey = (encrypted: string): string => {
  let decrypted = '';
  for (let i = 0; i < encrypted.length; i++) {
    decrypted += String.fromCharCode(encrypted.charCodeAt(i) ^ 137);
  }
  return decrypted;
};