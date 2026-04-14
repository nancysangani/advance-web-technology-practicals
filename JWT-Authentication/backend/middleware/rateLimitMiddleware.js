const requestStore = new Map();

const createRateLimiter = ({ windowMs, maxRequests, keyPrefix = "global" }) => {
  return (req, res, next) => {
    const key = `${keyPrefix}:${req.ip || req.socket.remoteAddress}`;
    const now = Date.now();
    const record = requestStore.get(key);

    if (!record || now > record.windowEnd) {
      requestStore.set(key, { count: 1, windowEnd: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((record.windowEnd - now) / 1000);
      res.set("Retry-After", retryAfterSeconds.toString());
      return res.status(429).json({
        message: "Too many attempts. Please try again later."
      });
    }

    record.count += 1;
    requestStore.set(key, record);
    return next();
  };
};

const loginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  maxRequests: 5,
  keyPrefix: "login"
});

module.exports = {
  loginLimiter
};
