import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import 'dotenv/config';

const redis = Redis.fromEnv();

const rateLimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(100, '60 s'),
});

export default rateLimit;

// import { Redis } from '@upstash/redis'
// import { RateLimit } from '@upstash/redis-ratelimit'
// import 'dotenv/config'
// const RateLimite = new RateLimit({
//     redis:Redis.fromEnv(),
//     Limiter : RateLimit.slidingWindow   (4, '60s'),

// })

// export default RateLimite
