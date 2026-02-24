import { spawn } from 'child_process';

export function fetchYoutubeMetadata(
  url: string
): Promise<{ title: string; id: string }> {
  return new Promise((resolve, reject) => {
    const proc = spawn('yt-dlp', ['--dump-json', '--no-playlist', url]);

    let data = '';

    proc.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    proc.on('close', (code) => {
      if (code !== 0) {
        reject(new Error('Failed to fetch metadata'));
        return;
      }

      try {
        const json = JSON.parse(data);
        resolve({
          title: json.title,
          id: json.id,
        });
      } catch {
        reject(new Error('Invalid metadata'));
      }
    });
  });
}
