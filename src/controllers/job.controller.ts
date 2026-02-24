import { Request, Response } from 'express';
import { jobStore } from '../utils/jobStore';
import { validateYoutubeUrl } from '../utils/validateYoutubeUrl';
import response from '../utils/response';
import { fetchYoutubeMetadata } from '../utils/ytMetaData';

export default {
  async createJob(req: Request, res: Response) {
    try {
      const { url, type } = req.body;
      const metadata = await fetchYoutubeMetadata(url);

      if (!url || typeof url !== 'string') {
        return res.status(400).json({ message: 'url is required' });
      }

      if (type !== 'audio' && type !== 'video') {
        return res.status(400).json({ message: 'invalid type' });
      }

      if (!validateYoutubeUrl(url)) {
        return res.status(400).json({ message: 'invalid youtube url' });
      }

      const job = jobStore.create(url, type, metadata.title);

      response.success(
        res,
        {
          jobId: job.id,
          title: job.title,
          status: job.status,
        },
        'Success to create job'
      );
    } catch (error) {
      response.error(res, error, 'Failed to create the Job');
    }
  },

  async getJob(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const job = jobStore.get(id);
      if (!job) {
        return res.status(404).json({ message: 'job not found' });
      }

      response.success(
        res,
        {
          id: job.id,
          status: job.status,
          error: job.error ?? null,
          downloadUrl:
            job.status === 'completed' ? `/download/${job.id}` : null,
        },
        'Job ready to download'
      );
    } catch (error) {
      response.error(res, error, 'Failed to get the Job');
    }
  },
};
