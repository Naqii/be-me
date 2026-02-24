import { JOB_TTL_MS } from './env';
import { Job } from './jobTypes';
import { randomUUID } from 'crypto';

class JobStore {
  private jobs = new Map<string, Job>();
  private queue: string[] = [];

  create(url: string, type: 'audio' | 'video', title: string): Job {
    const id = randomUUID();
    const now = Date.now();

    const job: Job = {
      id,
      url,
      title,
      type,
      status: 'queued',
      createdAt: now,
      expiresAt: now + JOB_TTL_MS,
    };

    this.jobs.set(id, job);
    this.queue.push(id);

    return job;
  }

  get(id: string): Job | undefined {
    return this.jobs.get(id);
  }

  dequeue(): Job | undefined {
    while (this.queue.length > 0) {
      const id = this.queue.shift()!;
      const job = this.jobs.get(id);

      if (!job) continue;
      if (job.status !== 'queued') continue;

      job.status = 'processing';
      return job;
    }

    return undefined;
  }

  complete(id: string, filePath: string) {
    const job = this.jobs.get(id);
    if (!job) return;

    job.status = 'completed';
    job.filePath = filePath;
    job.expiresAt = Date.now() + JOB_TTL_MS;
  }

  fail(id: string, error: string) {
    const job = this.jobs.get(id);
    if (!job) return;

    job.status = 'failed';
    job.error = error;
    job.expiresAt = Date.now() + JOB_TTL_MS;
  }

  expire(id: string) {
    const job = this.jobs.get(id);
    if (!job) return;

    job.status = 'expired';
  }

  cleanupExpired(): Job[] {
    const now = Date.now();
    const expired: Job[] = [];

    for (const [id, job] of this.jobs.entries()) {
      if (job.expiresAt <= now) {
        expired.push(job);
        this.jobs.delete(id);
      }
    }

    return expired;
  }
}

export const jobStore = new JobStore();
