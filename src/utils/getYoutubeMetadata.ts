import { spawn } from 'child_process';

export function getYoutubeMetadata(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    const process = spawn('yt-dlp', [
      '--dump-json',
      '--skip-download',
      '--no-playlist',
      url,
    ]);

    let data = '';

    process.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    process.stderr.on('data', (err) => {
      console.error('metadata error:', err.toString());
    });

    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error('Failed to fetch metadata'));
      }
      try {
        resolve(JSON.parse(data));
      } catch {
        reject(new Error('Invalid metadata response'));
      }
    });
  });
}
