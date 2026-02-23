import { Request, Response } from 'express';
import { jobStore } from '../utils/jobStore';
import { validateYoutubeUrl } from '../utils/validateYoutubeUrl';

export async function createJob(req: Request, res: Response) {
  try {
    const { url, type } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ message: 'url is required' });
    }

    if (type !== 'audio' && type !== 'video') {
      return res.status(400).json({ message: 'invalid type' });
    }

    if (!validateYoutubeUrl(url)) {
      return res.status(400).json({ message: 'invalid youtube url' });
    }

    const job = jobStore.create(url, type);

    return res.status(201).json({
      jobId: job.id,
      status: job.status,
    });
  } catch (err) {
    console.error('[POST /jobs]', err);
    return res.status(500).json({
      message: 'internal server error',
    });
  }
}

export async function getJob(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const job = jobStore.get(id);
    if (!job) {
      return res.status(404).json({ message: 'job not found' });
    }

    return res.json({
      id: job.id,
      status: job.status,
      error: job.error ?? null,
      downloadUrl: job.status === 'completed' ? `/download/${job.id}` : null,
    });
  } catch (err) {
    console.error('[GET /jobs/:id]', err);
    return res.status(500).json({
      message: 'internal server error',
    });
  }
}
