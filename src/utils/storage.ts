import { StoredPlaylist, BackupData, ViewMode, FilterMode } from '../types';

const STORAGE_KEYS = {
  API_KEY: 'youtube_api_key_encrypted',
  PLAYLISTS: 'stored_playlists',
  LAST_PLAYLIST_URL: 'last_playlist_url',
  VIEW_MODE: 'preferred_view_mode',
  FILTER_MODE: 'preferred_filter_mode',
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

// View and Filter preferences
export const saveViewMode = (viewMode: ViewMode): void => {
  localStorage.setItem(STORAGE_KEYS.VIEW_MODE, viewMode);
};

export const getViewMode = (): ViewMode => {
  const stored = localStorage.getItem(STORAGE_KEYS.VIEW_MODE);
  return (stored as ViewMode) || 'grid';
};

export const saveFilterMode = (filterMode: FilterMode): void => {
  localStorage.setItem(STORAGE_KEYS.FILTER_MODE, filterMode);
};

export const getFilterMode = (): FilterMode => {
  const stored = localStorage.getItem(STORAGE_KEYS.FILTER_MODE);
  return (stored as FilterMode) || 'all';
};

export const createBackup = (currentVideos: any[] = [], currentPlaylistInfo: any = null): BackupData => {
  console.log('🚀 BACKUP CREATION - CURRENT DATA ONLY');
  console.log('📊 Input data:', {
    currentVideosCount: currentVideos.length,
    hasPlaylistInfo: !!currentPlaylistInfo,
    playlistTitle: currentPlaylistInfo?.title,
    playlistId: currentPlaylistInfo?.id
  });

  // Only include current playlist data - no old data
  let finalPlaylists: StoredPlaylist[] = [];

  if (currentPlaylistInfo && currentVideos.length > 0) {
    console.log('✅ Creating backup with ONLY current playlist data');
    
    // Create ONLY the current playlist object
    const currentPlaylistData: StoredPlaylist = {
      id: currentPlaylistInfo.id,
      title: currentPlaylistInfo.title,
      thumbnail: currentPlaylistInfo.thumbnail,
      lastAccessed: new Date().toISOString(),
      videoCount: currentVideos.length,
      videos: currentVideos.map(video => ({
        id: video.id,
        index: video.index,
        thumbnail: video.thumbnail,
        title: video.title,
        duration: video.duration,
        unavailable: video.unavailable,
        videoId: video.videoId,
        channelTitle: video.channelTitle || 'Unknown Channel'
      }))
    };

    console.log('📝 Current playlist data created:', {
      id: currentPlaylistData.id,
      title: currentPlaylistData.title,
      videoCount: currentPlaylistData.videoCount,
      videosLength: currentPlaylistData.videos?.length || 0,
      firstVideoTitle: currentPlaylistData.videos?.[0]?.title,
      lastVideoTitle: currentPlaylistData.videos?.[currentPlaylistData.videos.length - 1]?.title
    });

    // ONLY include current playlist - no old data
    finalPlaylists = [currentPlaylistData];

    console.log('🎯 Final playlists array (current only):', {
      totalPlaylists: finalPlaylists.length,
      playlistTitle: finalPlaylists[0]?.title
    });

  } else {
    console.log('❌ No current data available for backup');
    finalPlaylists = [];
  }

  // Create the backup object with ONLY current data
  const backup: BackupData = {
    playlists: finalPlaylists,
    createdAt: new Date().toISOString(),
    version: '1.0.0',
    metadata: {
      totalPlaylists: finalPlaylists.length,
      totalVideos: finalPlaylists.reduce((acc, p) => acc + (p.videos?.length || p.videoCount || 0), 0),
      currentPlaylist: currentPlaylistInfo ? {
        id: currentPlaylistInfo.id,
        title: currentPlaylistInfo.title,
        videoCount: currentVideos.length
      } : null
    }
  };

  console.log('✅ BACKUP CREATION COMPLETED - CURRENT DATA ONLY');
  console.log('📊 Final backup stats:', {
    totalPlaylists: backup.playlists.length,
    totalVideos: backup.metadata.totalVideos,
    hasCurrentPlaylist: !!backup.metadata.currentPlaylist
  });

  return backup;
};

export const downloadBackup = (currentVideos: any[] = [], currentPlaylistInfo: any = null): void => {
  console.log('⬇️ DOWNLOAD INITIATED - CURRENT DATA ONLY');
  console.log('📥 Download parameters:', {
    videosReceived: currentVideos.length,
    playlistInfoReceived: !!currentPlaylistInfo,
    playlistTitle: currentPlaylistInfo?.title,
    playlistId: currentPlaylistInfo?.id
  });

  // Create backup with ONLY current data
  const backup = createBackup(currentVideos, currentPlaylistInfo);

  // Verify the backup contains ONLY our current data
  if (currentPlaylistInfo) {
    console.log('🔍 Final verification before download:', {
      backupPlaylistsCount: backup.playlists.length,
      backupVideoCount: backup.playlists[0]?.videos?.length || 0,
      originalVideoCount: currentVideos.length,
      isCurrentDataOnly: backup.playlists.length === 1 && backup.playlists[0].id === currentPlaylistInfo.id
    });

    if (backup.playlists.length !== 1 || backup.playlists[0].videos?.length !== currentVideos.length) {
      console.error('❌ BACKUP VERIFICATION FAILED!');
      throw new Error('Backup verification failed - current data not properly included');
    }
  }

  // Generate filename
  const timestamp = new Date().toISOString().split('T')[0];
  const playlistName = currentPlaylistInfo?.title 
    ? currentPlaylistInfo.title.replace(/[^a-zA-Z0-9\s-_]/g, '').replace(/\s+/g, '_').substring(0, 30)
    : 'playlist';
  
  const filename = `${playlistName}-${timestamp}.json`;

  // Create and trigger download
  const jsonString = JSON.stringify(backup, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  console.log('✅ DOWNLOAD COMPLETED - CURRENT DATA ONLY');
  console.log('📁 File details:', {
    filename,
    size: `${(jsonString.length / 1024).toFixed(2)} KB`,
    playlistsIncluded: backup.playlists.length,
    totalVideos: backup.metadata.totalVideos
  });
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