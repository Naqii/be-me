import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { Job } from '../jobTypes';
import { DOWNLOAD_DIR } from '../env';
import { jobStore } from '../jobStore';

const PROCESS_TIMEOUT_MS = 2 * 60 * 1000; // 2 menit

export async function runYtDlpJob(job: Job): Promise<void> {
  const outputExt = job.type === 'audio' ? 'mp3' : 'mp4';
  const outputPath = path.join(DOWNLOAD_DIR, `${job.id}.${outputExt}`);

  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });

  const args =
    job.type === 'audio'
      ? [
          job.url,
          '--no-playlist',
          '-x',
          '--audio-format',
          'mp3',
          '-o',
          outputPath,
        ]
      : [
          job.url,
          '--no-playlist',
          '-f',
          'bestvideo[height<=720]+bestaudio/best',
          '--merge-output-format',
          'mp4',
          '-o',
          outputPath,
        ];

  return new Promise((resolve) => {
    const proc = spawn('yt-dlp', args, {
      stdio: ['ignore', 'ignore', 'pipe'],
    });

    const timeout = setTimeout(() => {
      proc.kill('SIGTERM');
    }, PROCESS_TIMEOUT_MS);

    proc.stderr.on('data', (data) => {
      console.error(`[yt-dlp ${job.id}]`, data.toString());
    });

    proc.on('close', (code) => {
      clearTimeout(timeout);

      if (code === 0 && fs.existsSync(outputPath)) {
        jobStore.complete(job.id, outputPath);
      } else {
        jobStore.fail(job.id, 'yt-dlp failed');
        if (fs.existsSync(outputPath)) {
          fs.unlinkSync(outputPath);
        }
      }

      resolve();
    });

    proc.on('error', (err) => {
      clearTimeout(timeout);
      jobStore.fail(job.id, err.message);
      resolve();
    });
  });
}
