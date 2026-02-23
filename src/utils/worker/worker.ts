import { runCleanup } from './cleanup';
import { JOB_POLL_INTERVAL_MS, MAX_CONCURRENT_JOBS } from '../env';
import { jobStore } from '../jobStore';
import { runYtDlpJob } from './ytWorker';

let activeJobs = 0;
const CLEANUP_INTERVAL_MS = 60 * 1000;

setInterval(() => {
  try {
    runCleanup();
  } catch (err) {
    console.error('[cleanup] fatal error:', err);
  }
}, CLEANUP_INTERVAL_MS);

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function startWorker() {
  while (true) {
    if (activeJobs >= MAX_CONCURRENT_JOBS) {
      await sleep(JOB_POLL_INTERVAL_MS);
      continue;
    }

    const job = jobStore.dequeue();
    if (!job) {
      await sleep(JOB_POLL_INTERVAL_MS);
      continue;
    }

    activeJobs++;

    runYtDlpJob(job)
      .catch((err) => {
        console.error('[worker] job failed:', err);
      })
      .finally(() => {
        activeJobs--;
      });
  }
}
