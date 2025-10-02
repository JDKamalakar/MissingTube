import { StoredPlaylist, BackupData } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'youtube_api_key_encrypted',
  PLAYLISTS: 'stored_playlists',
  LAST_PLAYLIST_URL: 'last_playlist_url',
  // NEW KEY for temporary sample history flag
  IS_SAMPLE_ACTIVE: 'is_sample_history_active',
} as const;

// --- API Key Functions ---

export const saveApiKey = (encryptedKey: string): void => {
  localStorage.setItem(STORAGE_KEYS.API_KEY, encryptedKey);
};

export const getApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.API_KEY);
};

export const clearApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
};

// --- Playlist Functions ---

export const savePlaylists = (playlists: StoredPlaylist[]): void => {
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
};

export const getPlaylists = (): StoredPlaylist[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  return stored ? JSON.parse(stored) : [];
};

// --- Last Playlist URL Functions (FIXED/MODIFIED) ---

/**
 * Saves a URL to the REAL history and clears the temporary sample history flag.
 */
export const saveLastPlaylistUrl = (url: string): void => {
  // Clears the sample flag
  localStorage.removeItem(STORAGE_KEYS.IS_SAMPLE_ACTIVE);
  localStorage.setItem(STORAGE_KEYS.LAST_PLAYLIST_URL, url);
};

/**
 * Gets the last URL. Returns 'test_test' if sample history is active.
 */
export const getLastPlaylistUrl = (): string | null => {
  // Returns the sample indicator if active
  if (localStorage.getItem(STORAGE_KEYS.IS_SAMPLE_ACTIVE)) {
    return 'test_test'; 
  }
  // Otherwise, returns the real history item
  return localStorage.getItem(STORAGE_KEYS.LAST_PLAYLIST_URL);
};

// --- NEW Sample History Control Functions (The functions that were missing the export) ---

/**
 * Activates the flag indicating that temporary sample data is in use.
 */
export const activateSampleHistory = (): void => {
  localStorage.setItem(STORAGE_KEYS.IS_SAMPLE_ACTIVE, 'true');
};

/**
 * Deactivates and removes the flag, ensuring no sample data is loaded on the next refresh.
 */
export const deactivateSampleHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.IS_SAMPLE_ACTIVE);
};

// --- Backup & Restore Functions (Your original code) ---

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
  a.download = `Youtubelists-backup-${new Date().toISOString().split('T')[0]}.json`;
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
};