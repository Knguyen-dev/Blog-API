import Redis from "ioredis";

/*
+ Create a redis instance:
We'll use Redis as an in-memory cache.


+ Notes about appRedis.get() and the Error:
The error paraemter in the callback represents any errors that could occr while atetmpting to access the Redis server. Here are some of the most common cases:
1. Connection issues: If your app can't connect to the Redis server due to network issues, faulty connection settings, 
   the redis server is down, etc. then an error is thrown.
2. Redis server error: If the Redis server encounters some internal error while processing the request, an error is thrown.
3. Redis client error: If there's an issue with the redis client library that we've installed, such as an unexpected disconnect or a configuration error, then
   an error will be thrown.

- We found cached data, so resolve the promise with that cached data.
  Data in redis is stored as JSON string, however we want to convert this 
  into JSON object form. 

+ Primer on how JSON works:
1. Data from the server is prepared in the form of objects and arrays. This data is then converted 
  to a string format known as JSON (JavaScript Object Notation) for transmission.
2. When the client receives this JSON string, it needs to convert it back into a usable format. 
  This process is called parsing (deserialization). The client uses a JSON parser to convert the 
  JSON string into JavaScript objects or arrays.

- We will parse the JSON string here into JSON object form because 
  response.json() expects an object or array rather than a string. 
  If we just passed in the JSON string, then res.json treats it as a normal 
  string, and so when the receives and 'parses' the data, it'll still be 
  in string form?
*/


const appRedis = new Redis({
  port: 6379,
  host: "127.0.0.1",

  /*
  - When redis instance is instantiated, by default it automatically connects to the redis server.
    Set this to true so that doesn't happen, and we only connect when .connect() method 
    is called. This just gives us a little more control
  */
  lazyConnect: true,
});

/**
 * Returns a boolean dpeending on whether or not the current application is connected
 * to a Redis server. If true, our client is connected to a redis server, else false.
 * 
 * NOTE: If the client isn't connected to a Redis server, then when executing 
 * asynchronous functions such as getCache, setCache, or deleteCache, those functions
 * will get stuck on the asynchronous request, not returning anything and making us 
 * wait indefinintely. That's why we add teh conditional first to check if its connected, 
 * so when Redis isn't connected we can stop function execution early.
 */
const isRedisConnected = (): boolean => appRedis.status === "ready";





/**
 * Attempts to fetch and return pased data fron the cache. If data was found return the 
 * data. Else in cases where there's no data or we ran into an error, we should return null.
 * 
 * @param key - Key in the cache
 * 
 * NOTE: Only error we'd get here is an error related to interacting with Redis. Let's 
 * make sure it's handled here. 
 * 
 * 
 * Observation: if redis isn't running, the error should show up, but it doesn't. As a result we 
 * aren't given a response at all, which isn't good. Because at this point, we still need the 
 * redis server to be running for our app to even work
 * 
 */
const getCache = async (key: string) => {

  if (!isRedisConnected()) {
    console.error(`Redis not connected, can't get cache-key value for key '${key}'`);
    return null;
  }

  try {
    const data = await appRedis.get(key);
    if (!data) {
      return null;
    }

    // If data was defined, ensure it's parsed as a json object
    return JSON.parse(data);
  } catch (err: any) {
    console.error(`Error getting value from cache-key '${key}': ${err.message}`)  
  }
}

/**
 * Sets a cache key with a value. If key already exists, it'll replace it
 * 
 * @param key - The cache key 
 * @param expiration - Time to live (in seconds)
 * @param value - The new value for that cache key, our fresh data.
 */
const setCache = async (key: string, expiration: number, value: any) => {

  if (!isRedisConnected()) {
    console.error(`Redis not connected, can't set cache-key value for key '${key}'`);
    return;
  }

  try {
    await appRedis.setex(key, expiration, JSON.stringify(value));
  } catch (err: any) {
    console.error(`Error setting cache-key '${key}': ${err.message}`) 
  }
}

/**
 * Eliminates a key-value pair in the cache that's associated with 
 * a given key.
 * 
 * @param key - Key in the cache that we are eliminating 
 */
const deleteCache = async (key: string) => {

  if (!isRedisConnected()) {
    console.error("Redis not connected can't delete key!");
    return;
  }

  try {
    await appRedis.del(key);
  } catch (err: any) {
    console.error(`Error invalidating cache-key ${key}: ${err.message}`) 
  }
}




// connect to redis function
const connectRedis = async () => {
  try {
    await appRedis.connect();
    console.log("Connected to Redis Server")
  } catch (err: any) {
    console.error(err.message);
    appRedis.disconnect(); // Upon failure, stop and don't try to reconnect
  }
}


export {
  connectRedis,
  appRedis,
  getCache,
  setCache,
  deleteCache,
};
