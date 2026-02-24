export type JobStatus =
  | 'queued'
  | 'processing'
  | 'completed'
  | 'failed'
  | 'expired';

export interface Job {
  id: string;
  url: string;
  title: string;
  type: 'audio' | 'video';
  status: JobStatus;
  createdAt: number;
  expiresAt: number;
  filePath?: string;
  error?: string;
}
