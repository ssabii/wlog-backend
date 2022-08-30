import connect from "connect-redis";
import session from "express-session";
import { createClient } from "redis";

export const RedisStore = connect(session);

export const redisClient = createClient({ legacyMode: true });

export const connectRedis = async () => {
  await redisClient
    .connect()
    .then(() => {
      console.log("redis connected");
    })
    .catch((err) => {
      console.log(err);
    });
};
