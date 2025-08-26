import rateLimit from 'express-rate-limit';

const postLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Slow down! Too many messages posted. Try again later.' }
});

export default postLimiter;