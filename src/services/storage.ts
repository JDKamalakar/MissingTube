import { StoredPlaylist, BackupData } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'youtube_api_key_encrypted',
  PLAYLISTS: 'stored_playlists',
  LAST_PLAYLIST_URL: 'last_playlist_url',
} as const;

export const saveApiKey = (encryptedKey: string): void => {
  localStorage.setItem(STORAGE_KEYS.API_KEY, encryptedKey);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.API_KEY);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
};

export const savePlaylists = (playlists: StoredPlaylist[]): void => {
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
};

export const getPlaylists = (): StoredPlaylist[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  return stored ? JSON.parse(stored) : [];
};

export const saveLastPlaylistUrl = (url: string): void => {
  localStorage.setItem(STORAGE_KEYS.LAST_PLAYLIST_URL, url);
};

export const getLastPlaylistUrl = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.LAST_PLAYLIST_URL);
};

export const createBackup = (currentVideos: any[] = [], currentPlaylistInfo: any = null): BackupData => {
  const playlists = getPlaylists();
  
  // If we have current data, ensure it's included in the backup
  if (currentPlaylistInfo && currentVideos.length > 0) {
    const existingIndex = playlists.findIndex(p => p.id === currentPlaylistInfo.id);
    const playlistData = {
      id: currentPlaylistInfo.id,
      title: currentPlaylistInfo.title,
      thumbnail: currentPlaylistInfo.thumbnail,
      lastAccessed: new Date().toISOString(),
      videoCount: currentVideos.length,
      videos: currentVideos, // Include the latest video data
    };
    
    if (existingIndex >= 0) {
      playlists[existingIndex] = playlistData;
    } else {
      playlists.push(playlistData);
    }
    
    // Save the updated playlists to localStorage immediately
    savePlaylists(playlists);
  }
  
  return {
    playlists,
    createdAt: new Date().toISOString(),
    version: '1.0.0',
  };
};

export const downloadBackup = (currentVideos: any[] = [], currentPlaylistInfo: any = null): void => {
  const backup = createBackup(currentVideos, currentPlaylistInfo);
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: 'application/json',
  });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `youtube-playlists-backup-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const restoreFromBackup = (file: File): Promise<BackupData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const backup = JSON.parse(e.target?.result as string);
        if (backup.playlists && backup.createdAt && backup.version) {
          resolve(backup);
        } else {
          reject(new Error('Invalid backup file format'));
        }
      } catch (error) {
        reject(new Error('Failed to parse backup file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read backup file'));
    reader.readAsText(file);
  });
};11111