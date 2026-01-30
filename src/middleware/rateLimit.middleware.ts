import rateLimit from 'express-rate-limit';

export const brustLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 10 menit
  max: 2, // 5 request per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many download requests at same time. Try again in 5min.',
  },
});

export const dailyLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 10 menit
  max: 6, // 6 request per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Daily fetching URL Youtube limit reached. Try again after 24h.',
  },
});

export const shortenLimiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000, // 1 hari
  max: 5, // 5 short URL per IP per hari
  message: {
    message: 'Daily URL shortening limit reached. Try again after 24h.',
  },
});
