import Redis from "ioredis";

// Initialize redis client instance
const appRedis = new Redis(process.env.REDIS_URL as string, {
  lazyConnect: true
});



/**
 * Returns a boolean depending on whether the current application is connected
 * to a Redis server. If true, our client is connected to a redis server, else false.
 */
const isRedisConnected = (): boolean => {
    const status = appRedis.status;
    return status === "ready";
};


/**
 * Attempts to fetch and return parsed data from the cache. If data was found, return the data.
 * Else in cases where there's no data or we ran into an error, we should return null.
 *
 * @param key - Key in the cache
 */
const getCache = async (key: string) => {
  if (!isRedisConnected()) {
    return null;
  }

  try {
    const data = await appRedis.get(key);
    if (!data) {
      return null;
    }

    return JSON.parse(data);
  } catch (err: any) {
    console.error(`Error getting cache-key '${key}': ${err.message}`) 
    return null;
  }
};

/**
 * Sets a cache key with a value. If the key already exists, it'll replace it.
 *
 * @param key - The cache key
 * @param expiration - Time to live (in seconds)
 * @param value - The new value for that cache key, our fresh data.
 */
const setCache = async (key: string, expiration: number, value: any) => {
  if (!isRedisConnected()) {
    return;
  }

  try {
    await appRedis.setex(key, expiration, JSON.stringify(value));
  } catch (err: any) {
    console.error(`Error setting cache-key '${key}': ${err.message}`) 
  }
};

/**
 * Eliminates a key-value pair in the cache that's associated with a given key.
 *
 * @param key - Key in the cache that we are eliminating
 */
const deleteCache = async (key: string) => {
  if (!isRedisConnected()) {
    return;
  }

  try {
    await appRedis.del(key);
  } catch (err: any) {
    console.error(`Error invalidating cache-key ${key}: ${err.message}`);
  }
};

// Function to connect to Redis, if not already connected
const connectRedis = async () => {
  try {

    // If already connected, then stop the connection process early
    if (isRedisConnected()) {
      return;
    }

    await appRedis.connect();
    console.log("Redis is connected!");
  } catch (err: any) {
    console.error(`Failed to connect to Redis: ${err.message}`);
    appRedis.disconnect(); // Upon failure, stop and don't try to reconnect
  }
};


export {
  connectRedis,
  getCache,
  setCache,
  deleteCache,
};
