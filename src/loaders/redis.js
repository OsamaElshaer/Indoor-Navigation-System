const { createClient } = require("redis");
const { logger } = require("../utils/logger");
const { redisHost } = require("../config/env");

const client = createClient({
    url: redisHost,
});

const connectToRedis = async () => {
    try {
        await client.connect();
        logger.info("Redis connected successfully!");
    } catch (error) {
        logger.error("Error connecting to Redis:", error);
    }
};

// connectToRedis();

module.exports = { client };

client.on("connect", () => {
    logger.info("Connected to Redis successfully");
});

client.on("error", (err) => {
    logger.error("Error connecting to Redis:", err);
});

client.on("ready", () => {
    logger.info("Redis connection is ready");
});

client.on("close", () => {
    logger.info("Redis connection closed");
});

module.exports = {
    client,
};
