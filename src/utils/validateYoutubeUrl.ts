export function validateYoutubeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);

    const allowedHosts = new Set([
      'www.youtube.com',
      'youtube.com',
      'm.youtube.com',
      'youtu.be',
    ]);

    if (!allowedHosts.has(parsed.hostname)) {
      return false;
    }

    // Block playlist explicitly
    if (parsed.searchParams.has('list')) {
      return false;
    }

    // youtu.be/<id>
    if (parsed.hostname === 'youtu.be') {
      const videoId = parsed.pathname.slice(1);
      return isValidVideoId(videoId);
    }

    // youtube.com/watch?v=<id>
    if (parsed.pathname === '/watch') {
      const videoId = parsed.searchParams.get('v');
      return isValidVideoId(videoId);
    }

    // youtube.com/shorts/<id>
    if (parsed.pathname.startsWith('/shorts/')) {
      const videoId = parsed.pathname.split('/')[2];
      return isValidVideoId(videoId);
    }

    return false;
  } catch {
    return false;
  }
}

function isValidVideoId(id: string | null): boolean {
  if (!id) return false;

  // YouTube video IDs are 11 chars, URL-safe
  return /^[a-zA-Z0-9_-]{11}$/.test(id);
}
