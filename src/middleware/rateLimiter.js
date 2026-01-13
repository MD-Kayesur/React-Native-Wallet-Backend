import rateLimit from '../config/upstash.js';

const ratelimiter = async (req, res, next) => {
  try {
    const ip = req.ip || 'global';

    const { success } = await rateLimit.limit(ip);

    if (!success) {
      return res.status(429).json({
        message: 'Rate limit exceeded, please try again later',
      });
    }

    next();
  } catch (error) {
    console.error('Rate limit error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default ratelimiter;

//  import RateLimite from "../config/upstash.js";
// const ratelimiter = async (req, res, next) => {
//     try {
//    const { success } = await RateLimite.limit("my-rate-limit")
//     if (!success) {
//        return res.status(429).json({
//        message:"Rate limit exceeded plece try again later"})
//     }
//     next()

//     } catch (error) {
//         console.error("Rate limit error:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//         next(error);
//     }

// };

// export default ratelimiter;
