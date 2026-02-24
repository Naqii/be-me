import dotenv from 'dotenv';

dotenv.config();

export const DATABASE_URL: string = process.env.DATABASE_URL || '';

export const BASE_URL: string = process.env.BASE_URL || '';

export const SECRET: string = process.env.SECRET || '';

export const EMAIL_SMTP_SECURE: boolean =
  Boolean(process.env.EMAIL_SMTP_SECURE) || false;

export const EMAIL_SMTP_PASS: string = process.env.EMAIL_SMTP_PASS || '';

export const EMAIL_SMTP_USER: string = process.env.EMAIL_SMTP_USER || '';

export const EMAIL_SMTP_PORT: number =
  Number(process.env.EMAIL_SMTP_PORT) || 465;

export const EMAIL_SMTP_HOST: string = process.env.EMAIL_SMTP_HOST || '';

export const EMAIL_SMTP_SERVICE_NAME: string =
  process.env.EMAIL_SMTP_SERVICE_NAME || '';

export const CLIENT_HOST: string =
  process.env.CLIENT_HOST || 'http://localhost:3001';

export const CLOUDINARY_API_KEY: string = process.env.CLOUDINARY_API_KEY || '';

export const CLOUDINARY_API_SECRET: string =
  process.env.CLOUDINARY_API_SECRET || '';

export const CLOUDINARY_CLOUD_NAME: string =
  process.env.CLOUDINARY_CLOUD_NAME || '';

export const MAX_CONCURRENT_JOBS: number =
  Number(process.env.MAX_CONCURRENT_JOBS) || 1;

export const JOB_TTL_MS: number =
  Number(process.env.JOB_TTL_MS) || 3 * 60 * 1000;

export const JOB_POLL_INTERVAL_MS: number =
  Number(process.env.JOB_POLL_INTERVAL_MS) || 1000; // worker sleep

export const DOWNLOAD_DIR: string = process.env.DOWNLOAD_DIR || '';
