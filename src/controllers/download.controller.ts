import { Request, Response } from 'express';
import fs from 'fs';
import { jobStore } from '../utils/jobStore';
import response from '../utils/response';

function sanitizeFilename(name: string) {
  return name
    .replace(/[^\w\s.-]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export default {
  async downloadJobResult(req: Request, res: Response) {
    try {
      const job = jobStore.get(req.params.jobId);

      if (!job) {
        return res.status(404).json({ message: 'job not found' });
      }

      if (job.status !== 'completed' || !job.filePath) {
        return res.status(400).json({
          message: 'job is not ready for download',
        });
      }

      // ✅ nama untuk USER
      const displayName = sanitizeFilename(
        `${job.title} [${job.id}].${job.type === 'audio' ? 'mp3' : 'mp4'}`
      );

      // ✅ header UX
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${displayName}"`
      );

      res.setHeader(
        'Content-Type',
        job.type === 'audio' ? 'audio/mpeg' : 'video/mp4'
      );

      // ✅ file SYSTEM
      const stream = fs.createReadStream(job.filePath);

      stream.on('error', (err) => {
        console.error('[download stream error]', err);
        if (!res.headersSent) {
          res.status(500).end();
        }
      });

      stream.pipe(res);
    } catch (error) {
      response.error(res, error, 'Failed to download');
    }
  },
};
