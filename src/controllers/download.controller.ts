import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { jobStore } from '../utils/jobStore';

export async function downloadJobResult(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const job = jobStore.get(id);
    if (!job) {
      return res.status(404).json({ message: 'job not found' });
    }

    if (job.status !== 'completed' || !job.filePath) {
      return res.status(400).json({
        message: 'job is not ready for download',
      });
    }

    const filePath = path.resolve(job.filePath);

    if (!fs.existsSync(filePath)) {
      return res.status(410).json({
        message: 'file expired or missing',
      });
    }

    // Set minimal, honest headers
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${path.basename(filePath)}"`
    );

    const stream = fs.createReadStream(filePath);

    stream.on('error', (err) => {
      console.error('[download stream error]', err);
      if (!res.headersSent) {
        res.status(500).end();
      }
    });

    stream.pipe(res);
  } catch (err) {
    console.error('[GET /download/:id]', err);
    return res.status(500).json({
      message: 'internal server error',
    });
  }
}
