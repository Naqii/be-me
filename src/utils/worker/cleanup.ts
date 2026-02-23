import fs from 'fs';
import path from 'path';
import { jobStore } from '../jobStore';
import { DOWNLOAD_DIR } from '../env';

export function runCleanup() {
  const expiredJobs = jobStore.cleanupExpired();

  if (expiredJobs.length === 0) {
    return;
  }

  for (const job of expiredJobs) {
    if (!job.filePath) continue;

    try {
      const filePath = path.resolve(job.filePath);

      // Extra safety: only delete files inside DOWNLOAD_DIR
      if (!filePath.startsWith(path.resolve(DOWNLOAD_DIR))) {
        console.error('[cleanup] blocked unsafe path:', filePath);
        continue;
      }

      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log('[cleanup] deleted', filePath);
      }
    } catch (err) {
      console.error('[cleanup] failed to delete file:', err);
    }
  }
}
