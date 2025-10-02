// Assuming this is your main utility file, e.g., 'utils/youtube.ts'

/**
 * Extracts the playlist ID from a YouTube URL.
 * @param url The YouTube URL or ID string.
 * @returns The extracted playlist ID.
 */
export const extractPlaylistId = (url: string): string => {
  // Check for the special 'test_test' string
  if (url.toLowerCase() === 'test_test') {
    return 'test_test';
  }
  
  // Existing logic to extract ID from URL
  const regex = /[?&]list=([a-zA-Z0-9_-]+)/;
  const match = url.match(regex);
  if (match) {
    return match[1];
  }

  // If it doesn't look like a URL, assume it's already an ID
  return url;
};

/**
 * Generates a fake playlist URL for use in sample history.
 * @param index The index number for unique identification.
 * @returns A dummy YouTube playlist URL.
 */
export const generateSampleUrl = (index: number): string => {
  const paddedIndex = String(index).padStart(2, '0');
  return `https://www.youtube.com/playlist?list=SAMPLE_PLAYLIST_ID_${paddedIndex}`;
};