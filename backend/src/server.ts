import { connectRedis } from "./services/caches/redis.services";
import connectDB from "./config/database";
import app from "./app";




connectDB().then(() => {

  // Start the Express Server
  app.listen(process.env.PORT, () => {
    console.log(`Connected to DB & listening on port ${process.env.PORT}`)
  });

  /*
  + Redis Connection:
  The idea here is that, we may or may not always have an active Redis server involved in our 
  application. So our app starting shouldn't be based on whether or not connectRedis works.

  However if we do have an active Redis server involved in our application, it will rely on 
  a database connection because our redis connection will have times where it fetches data
  from the database. So only try to connect to the Redis server after we've gotten the database
  connection.

  - NOTE: If an error is thrown, it'll be handled in connectRedis rather than being propagated 
    up here.
  */
  connectRedis();  
}).catch((err) => {
  // Handle any errors
  console.error("Failed to connect:", err);
});