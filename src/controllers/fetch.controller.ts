import { Request, Response } from 'express';
import { runYtDlp } from '../utils/ytDlp';
import { validateYoutubeUrl } from '../utils/validateYoutube';
import { getYoutubeMetadata } from '../utils/getYoutubeMetadata';

const MAX_AUDIO_DURATION = 10 * 60; // 10 menit
const MAX_VIDEO_DURATION = 10 * 60; // 10 menit
const PROCESS_TIMEOUT = 120_000; // 120 detik

export default {
  async downloadMedia(req: Request, res: Response) {
    try {
      const { url, type } = req.query;

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: 'URL is required' });
      }

      if (type !== 'audio' && type !== 'video') {
        return res.status(400).json({ message: 'Invalid type' });
      }

      if (!validateYoutubeUrl(url)) {
        return res.status(400).json({ message: 'Invalid YouTube URL' });
      }

      const maxDuration =
        type === 'audio' ? MAX_AUDIO_DURATION : MAX_VIDEO_DURATION;

      const metadata = await getYoutubeMetadata(url);

      if (!metadata.duration || metadata.duration > maxDuration) {
        return res.status(400).json({
          message: 'Media duration exceeds limit max 10min',
        });
      }

      const ytProcess = runYtDlp(url, type, maxDuration);

      const timeout = setTimeout(() => {
        ytProcess.kill('SIGKILL');
      }, PROCESS_TIMEOUT);

      ytProcess.stderr.on('data', (data) => {
        console.error('yt-dlp error:', data.toString());
      });

      ytProcess.on('error', (err) => {
        clearTimeout(timeout);
        console.error('yt-dlp spawn error:', err);
        if (!res.headersSent) {
          res.status(500).json({ message: 'Failed to start download process' });
        }
      });

      ytProcess.on('close', (code) => {
        clearTimeout(timeout);
        if (code !== 0 && !res.headersSent) {
          res.status(500).json({ message: 'Failed to fetch media' });
        }
      });

      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${type === 'audio' ? 'audio.mp3' : 'video.mp4'}"`
      );

      res.setHeader(
        'Content-Type',
        type === 'audio' ? 'audio/mpeg' : 'video/mp4'
      );

      ytProcess.stdout.pipe(res);
    } catch (error) {
      console.error('downloadMedia fatal error:', error);
      if (!res.headersSent) {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  },
};
