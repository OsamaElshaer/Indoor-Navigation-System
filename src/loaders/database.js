const { MongoClient } = require("mongodb");
const { logger } = require("../utils/logger");
const { dbHost } = require("../config/env");

const url = dbHost;
let _db;

const mongoConnect = async () => {
    try {
        const client = await MongoClient.connect(url);
        if (process.env.NODE_ENV === "test") {
            _db = client.db("testindoorNavigation");
        } else {
            _db = client.db("indoorNavigation");

            logger.info("Connected to MongoDB successfully");
        }
    } catch (error) {
        logger.error("Failed to connect to the database:", error.message);
        throw new Error("Failed to connect to the database");
    }
};

const getDb =  () => {
    if (_db) {
        return _db;
    }
    throw new Error("No database connection");
};

module.exports = { mongoConnect, getDb };
