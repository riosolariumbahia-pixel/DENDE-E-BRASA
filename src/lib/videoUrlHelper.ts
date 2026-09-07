export interface VideoSourceInfo {
  type: 'youtube' | 'vimeo' | 'direct';
  embedUrl?: string;
  directUrl?: string;
  videoId?: string;
}

/**
 * Parses any video string (YouTube URL, YouTube Shorts, Vimeo, or direct MP4/WEBM/MOV/Blob)
 * and returns clean embed or direct playback info.
 */
export function parseVideoUrl(url: string | null | undefined): VideoSourceInfo {
  if (!url || typeof url !== 'string') {
    return { type: 'direct', directUrl: '/dende-e-brasa-espaco.mp4' };
  }

  const trimmed = url.trim();

  // YouTube detection (youtube.com/watch?v=..., youtu.be/..., youtube.com/shorts/..., youtube.com/embed/...)
  const ytMatch = trimmed.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|v\/|shorts\/))([\w-]{11})/i);
  if (ytMatch && ytMatch[1]) {
    const videoId = ytMatch[1];
    return {
      type: 'youtube',
      videoId,
      embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&playsinline=1&controls=1&rel=0&modestbranding=1`
    };
  }

  // Vimeo detection (vimeo.com/...)
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeoMatch && vimeoMatch[1]) {
    const vimeoId = vimeoMatch[1];
    return {
      type: 'vimeo',
      videoId: vimeoId,
      embedUrl: `https://player.vimeo.com/video/${vimeoId}?autoplay=1&muted=1&loop=1&playsinline=1`
    };
  }

  // Direct media file (.mp4, .mov, .webm, blob:, /uploads/..., etc.)
  return {
    type: 'direct',
    directUrl: trimmed
  };
}
