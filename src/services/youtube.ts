import { Video, PlaylistInfo } from '../types';
import { formatDuration } from '../utils/youtube';

export class YouTubeService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchPlaylistInfo(playlistId: string): Promise<PlaylistInfo | null> {
    const url = `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&id=${playlistId}&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const item = data.items[0];
        return {
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
          channelTitle: item.snippet.channelTitle,
          videoCount: item.contentDetails.itemCount,
        };
      }
      return null;
    } catch (error) {
      console.error('Error fetching playlist info:', error);
      return null;
    }
  }

  async fetchVideos(
    playlistId: string,
    pageToken = '',
    startIndex = 1,
    videos: Video[] = []
  ): Promise<Video[]> {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${this.apiKey}&pageToken=${pageToken}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items) {
        const videoPromises = data.items.map(async (item: any, index: number) => {
          const videoId = item.snippet.resourceId.videoId;
          let thumbnailUrl = 'https://via.placeholder.com/120x90/cccccc/666666?text=Unavailable';
          
          if (item.snippet.thumbnails?.default) {
            thumbnailUrl = item.snippet.thumbnails.default.url;
          }
          
          // Fetch channel title for each video
          const channelTitle = await this.getChannelTitle(item.snippet.videoOwnerChannelId);
          
          return {
            id: `${playlistId}-${videoId}`,
            index: startIndex + index,
            thumbnail: thumbnailUrl,
            title: item.snippet.title,
            duration: await this.getVideoDuration(videoId),
            unavailable: !item.snippet.thumbnails?.default,
            videoId,
            channelTitle: channelTitle || item.snippet.videoOwnerChannelTitle || 'Unknown Channel',
          };
        });
        
        const newVideos = await Promise.all(videoPromises);
        videos = videos.concat(newVideos);
        
        if (data.nextPageToken) {
          return this.fetchVideos(
            playlistId,
            data.nextPageToken,
            startIndex + data.items.length,
            videos
          );
        }
        
        return videos;
      }
      
      return videos;
    } catch (error) {
      console.error('Error fetching videos:', error);
      return videos;
    }
  }

  async fetchVideoDetails(videoId: string): Promise<any> {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        return {
          description: video.snippet.description,
          publishedAt: video.snippet.publishedAt,
          viewCount: video.statistics.viewCount || '0',
          likeCount: video.statistics.likeCount || '0',
          channelTitle: video.snippet.channelTitle,
        };
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching video details:', error);
      return null;
    }
  }

  private async getChannelTitle(channelId: string): Promise<string | null> {
    if (!channelId) return null;
    
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet&id=${channelId}&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        return data.items[0].snippet.title;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching channel title:', error);
      return null;
    }
  }

  private async getVideoDuration(videoId: string): Promise<string> {
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${this.apiKey}`;
    
    try {
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.items && data.items.length > 0) {
        const duration = data.items[0].contentDetails.duration;
        return formatDuration(duration);
      }
      
      return 'Unavailable';
    } catch (error) {
      console.error('Error fetching video duration:', error);
      return 'Unavailable';
    }
  }
}