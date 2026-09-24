# Rate Limiting

Rate limiting is done using Redis in this app.  Redis may not be absolutely necessary while we only have one server instance, but once we need horizontal scaling, we'll need it.  Without a shared Redis instance between the servers, we could only limit per server, instead of having one rate limit for each user/route.

## General rate limiting stuff

The package we're using is `rate-limiter-flexible`, and it provides the rate limiter logic.  But for configuration, it's good to know more about what each argument is conceptually.

`points` is the number of requests that can happen within a certain period, and `duration` is that period.  `consume` is the action of a user/ip hitting an endpoint and using one of the allowed points for that duration.

When a user hits an endpoint, the timer starts.  A user can then send requests to that endpoint until their points are consumed.  Once they are consumed, then all requests are rejected until the duration passes.  Once the duration passes, everything resets, effectively giving the user back their points.

This does mean there is the possibility of approximately doubling our rate limit by bad actors.  If a route has 1000 points for some duration, a user could send a single request and right before the duration expires send the other 999.  Right after, the duration expires and they can send another 1000.  I don't _think_ it's a huge concern if we rate limit properly.

Another optional parameter is `blockDuration`.  This is used when you want a user who hits the rate limit to be locked out longer than the duration.  This allows you to have an endpoint that allows 10 requests per minute, but if the user goes over, they're blocked from that endpoint for the next 5 minutes.

While it might seem like only the points/duration ratio matters (i.e. 5/60s vs 50/600s) are the same, they allow for different amounts of burst traffic.  5/60s would never allow 50 requests to go through at once, but 50/600s would.

When defining a bursty vs a standard rate limiter (from the `rate-limiter-flexible` package), standard limiters allow for a single window: a `points`, a `duration`, and an optional `blockDuration`.  Bursty limiters allow for two.  The first window's points are used first and then the second's.  Generally, this means that the first window is how you would like to limit standard traffic, and the second window says if you want the user to have any extra uses within a larger timeframe.

For example, an endpoint might have a 1/60s window and a 5/3600s window.  This means that the user is allowed 1 hit every 60 seconds, but within the hour, they're allowed an extra 5 accesses.

Some examples from the app:
- Login and register by IP: generally, we shouldn't have too many people logging in or registering from a single IP, but logging in/registering many many times from a single IP can signal people fishing for login info.  We want a relatively low points and a relatively long duration here (currently 5/3600s for registering and 20/900s for login), but because IPs are potentially shared, we don't want to add a block duration.  Many logins or registers could indicate a shared IP like a school or coffee shop, and if there are multiple users genuinely registering or logging in, we don't want to overly punish those last users.
- The login route for an account (keyed off of `login:account`): this one is keyed on the account being logged into, not on the IP.  That's deliberate.  The IP limiter can't see an attack spread across many hosts against a single account, and that's exactly the attack worth catching.  It's currently 10/3600s + 900, so ten failures in an hour lock that account for 15 minutes.  The ratio matters more than the block here.  `blockDuration` only punishes bursting: an attacker pacing just under a short window never trips it at all.  When this was 5/60s, someone sending 4 failures a minute sustained roughly 236 guesses an hour and was never blocked once.  At 10/3600s the ceiling is 10 an hour however they pace it.  The larger values are still doing burst work though: at the same ratio (1/360s) a user who fat-fingers their password would wait six minutes to try again, whereas now they get ten tries back to back.
- The upload route: this is the use case for a bursty limiter, with no block duration at all.  When a user is creating their profile, they'll upload several pictures of their pets and then maybe never upload another file again. That's why it's set to a bursty limiter with 1/120s and 10/3600s.  A user generally only needs to upload things once every couple of minutes (for the occasional update), but within an hour, they get an extra ten uploads in case they're building their profile.
- Chat invites: Users may send several chat invites in a row, but this is also a huge harassment vector.  So we want a user to be able to send like 10 chat invites as they're scanning the map, but not allow them to send hundreds or send even more before those users could possibly respond.  So it's set to something like 10/3600s.  You get 10 an hour.  This is another use case for higher values with a given points/duration ratio.  If we set this to 1/60s, a user would send an invite and have to wait 60s to send another one.  These larger values allow for burst but still rate limit for the use case.

## Environments

For local development, Redis is not used at all.  Leaving the `REDIS_URL` env var unset falls back to local memory, which is fine for local dev.  This isn't something the package does for us: `rate-limiter-flexible` ships two separate classes, `RateLimiterRedis` and `RateLimiterMemory`, that share an interface, and `makeLimiter` picks between them based on whether `REDIS_URL` is set.  You can see this in `server/src/lib/limiters.ts`.

One consequence worth knowing: because dev runs on the memory store, the Redis path is only exercised by the tests and in prod.  A broken `REDIS_URL` won't show up locally.

For tests, a redis instance is spun up.  Since we're already using docker to spin up a Postgres instance, we might as well spin up a Redis one too to make sure we're using the actual API when testing.

For prod, a redis instance is supported in Railway.  It currently allows for local networking from within the Railway project with environment variables.  There is a publicly exposed url, but we won't need it.

## How it's applied

The rate limiting is applied through middleware.  For most cases, it's applied to each route.  Looking at `server/src/app.ts`, you can see that the `.use` statements are applying the rate limits to each route.  However, if we need to rate limit by method (i.e. POST vs GET), we need to apply it to the specific method route in the routes file.  `POST /invites` is a good example.

Not everything goes through HTTP middleware, though.  Messages can be sent over socket.io as well as through `POST /chats/:id`, and sockets bypass Hono middleware entirely.  So `sendMessage` in `server/src/socket/socketHandlers.ts` consumes from the same `messageLimiter` directly.  Both transports share one limiter, so a user can't double their budget by mixing them.  Anything new added on the socket side needs the same treatment or it's a hole straight around the limits.

This middleware is defined in `server/src/lib/rateLimit.ts`.  There are three arguments, the third optional:

1. The limiter.  These are created in `server/src/lib/limiters.ts` and effectively are the config.  I'll go more into what these are below.
2. The value to rate limit on. This will be either the userId if the route requires the user to be logged in or on the IP if the route is unauthenticated.  Limiting on IP is not fantastic, but for unauthenticated routes, it's the best thing to do.  The per-account login limiter is the exception to both: it keys on the email address being logged into, so it applies no matter where the requests come from.
3. Optionally, how many points the request costs, defaulting to 1.  This is there so an expensive route can draw more heavily on a shared budget than a cheap one.  Nothing uses it yet.

While the `rateLimit` function used for each route creates the middleware, the particular limiters in `limiters.ts` are configured for each route. They say whether we want a standard or bursty rate limiter (whether or not to wrap the standard `RateLimiterRedis` or `RateLimiterMemory` in a `BurstyRateLimiter`, all from the `rate-limiter-flexible` package) and the configuration for that limiter.  Standard limiters will have a single object with `points`, `duration`, and an optional `blockDuration`, while a bursty limiter will have two of those objects: one for standard use and one for burst handling.

## How it works

Effectively, the middleware has a key for each limiter paired with whatever that limiter counts by — userId, IP, or account.  These values are stored in Redis for easy O(1) access.  When receiving a request aimed at a limited route, it tries to consume one of the request points.  If it can, it does and the request proceeds as normal.  If it can't (because the count is already above the allocated points), then it fails and returns 429 with a Retry-After header.

Also, Railway proxies app access, but stores the originating IP in the `x-forwarded-for` header.  That's why we check that header instead of the actual IP for IP limited routes.

That header is a comma-separated chain, not a single value, and each proxy appends to it as the request passes through.  The *leftmost* entry is whatever the client sent, which means it's trivially forged.  We take the **last** entry, which is the one Railway's proxy appended.  Don't simplify this to `split(',')[0]` — that would let anyone bypass every IP limit just by sending their own header.

One more thing: the per-account rate limiting for login has to live in the route handler itself rather than in middleware, because the count depends on whether the login succeeded.  Login is rate limited as a certain number of failures per hour, not a certain number of attempts per hour.  The handler consumes a point up front and then calls `delete()` on the key if the login succeeds.  That clears the count entirely — not just the point from this request, but any earlier failures too — so a user who mistypes nine times and then gets it right is back to a full budget.  The IP limiter on login is ordinary middleware and is not refunded.

## Work to still be done

The numbers currently in limiters.ts are just estimates.  Setting `RATE_LIMIT_MODE` to `monitor` just logs blocked attempts instead of actually blocking them.  This is how you would actually get reasonable numbers for these when you actually have traffic.  Monitor traffic for a week or so using that environment variable, and then create the numbers based on that data.