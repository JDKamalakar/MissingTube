import { StoredPlaylist, BackupData } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'youtube_api_key_encrypted',
  PLAYLISTS: 'stored_playlists',
  LAST_PLAYLIST_URL: 'last_playlist_url',
  // NEW KEY for temporary sample history
  IS_SAMPLE_ACTIVE: 'is_sample_history_active',
} as const;

// --- API Key Functions (Exports are fine) ---
export const saveApiKey = (encryptedKey: string): void => {
  localStorage.setItem(STORAGE_KEYS.API_KEY, encryptedKey);
};
export const getApiKey = (): string | null => {
  return localStorage.getItem(STORAGE_KEYS.API_KEY);
};
export const clearApiKey = (): void => {
  localStorage.removeItem(STORAGE_KEYS.API_KEY);
};

// --- Playlist Functions (Exports are fine) ---
export const savePlaylists = (playlists: StoredPlaylist[]): void => {
  localStorage.setItem(STORAGE_KEYS.PLAYLISTS, JSON.stringify(playlists));
};
export const getPlaylists = (): StoredPlaylist[] => {
  const stored = localStorage.getItem(STORAGE_KEYS.PLAYLISTS);
  return stored ? JSON.parse(stored) : [];
};

// --- Last Playlist URL Functions (Exports are fine) ---
// Note: These were modified but still exported correctly.
export const saveLastPlaylistUrl = (url: string): void => {
  localStorage.removeItem(STORAGE_KEYS.IS_SAMPLE_ACTIVE);
  localStorage.setItem(STORAGE_KEYS.LAST_PLAYLIST_URL, url);
};
export const getLastPlaylistUrl = (): string | null => {
  if (localStorage.getItem(STORAGE_KEYS.IS_SAMPLE_ACTIVE)) {
    return 'test_test'; 
  }
  return localStorage.getItem(STORAGE_KEYS.LAST_PLAYLIST_URL);
};

// --- NEW Sample History Control Functions (Crucial Exports) ---

/**
 * Ensures this function is exported so other modules (like PlaylistFetcher) can import it.
 */
export const activateSampleHistory = (): void => {
  localStorage.setItem(STORAGE_KEYS.IS_SAMPLE_ACTIVE, 'true');
};

/**
 * Ensures this function is exported so other modules (like PlaylistFetcher) can import it.
 */
export const deactivateSampleHistory = (): void => {
  localStorage.removeItem(STORAGE_KEYS.IS_SAMPLE_ACTIVE);
};

// --- Backup & Restore Functions (Exports are fine) ---

export const createBackup = (currentVideos: any[] = [], currentPlaylistInfo: any = null): BackupData => {
  // ... (implementation)
  return {
    playlists: getPlaylists(), // Simplified here for brevity
    createdAt: new Date().toISOString(),
    version: '1.0.0',
  };
};

export const downloadBackup = (currentVideos: any[] = [], currentPlaylistInfo: any = null): void => {
  // ... (implementation)
};

export const restoreFromBackup = (file: File): Promise<BackupData> => {
  // ... (implementation)
  return new Promise((resolve, reject) => { /* ... */ });
};