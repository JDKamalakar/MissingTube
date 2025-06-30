export interface Video {
  id: string;
  index: number;
  thumbnail: string;
  title: string;
  duration: string;
  unavailable: boolean;
  videoId: string;
  channelTitle?: string;
}

export interface PlaylistInfo {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  videoCount: number;
}

export interface StoredPlaylist {
  id: string;
  title: string;
  thumbnail: string;
  lastAccessed: string;
  videoCount: number;
  videos?: Video[]; // Store complete video data for backup
}

export interface PlaylistStats {
  totalVideos: number;
  availableVideos: number;
  unavailableVideos: number;
  totalDuration: string;
  averageDuration: string;
}

export interface BackupData {
  playlists: StoredPlaylist[];
  createdAt: string;
  version: string;
  metadata?: {
    totalPlaylists: number;
    totalVideos: number;
    currentPlaylist?: {
      id: string;
      title: string;
      videoCount: number;
    } | null;
  };
}

export type ViewMode = 'grid' | 'table';
export type FilterMode = 'all' | 'available' | 'unavailable';