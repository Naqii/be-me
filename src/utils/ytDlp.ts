import { spawn } from 'child_process';

export function runYtDlp(
  url: string,
  type: 'audio' | 'video',
  maxDurationSec: number
) {
  const baseArgs = [
    '--no-playlist',
    '--max-downloads',
    '1',
    '--match-filter',
    `duration <= ${maxDurationSec}`,
  ];

  const formatArgs =
    type === 'audio'
      ? ['-f', 'bestaudio', '-o', '-']
      : ['-f', 'best[height<=720]', '-o', '-'];

  const args = [...baseArgs, ...formatArgs, url];

  const process = spawn('yt-dlp', args, {
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  return process;
}
