export function validateYoutubeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    const allowedHosts = [
      'www.youtube.com',
      'youtube.com',
      'youtu.be',
      'm.youtube.com',
    ];

    if (!allowedHosts.includes(parsed.hostname)) return false;
    if (parsed.searchParams.has('list')) return false; // block playlist

    return true;
  } catch {
    return false;
  }
}
