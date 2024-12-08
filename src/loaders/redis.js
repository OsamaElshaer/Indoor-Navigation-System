const { createClient } = require("redis");
const { redisHost } = require("../config/env");

const client = createClient({ url: redisHost });
client.on("connect", () => {
    console.log("Connected to Redis");
});

client.on("error", (err) => {
    console.error("Error connecting to Redis:", err);
});

client.on("ready", () => {
    console.log("Redis connection is ready");
});

client.on("close", () => {
    console.log("Redis connection closed");
});

module.exports = {
    client,
};
