const { jwtSecretKey } = require("../config/env");
const jwt = require("jsonwebtoken");

const { AccessPointModel } = require("../models/accessPoints.model");
const { OrganizationModel } = require("../models/organization.model");
const { calculatePositioning } = require("../utils/navigation/positioning");

const accessPointObject = new AccessPointModel();
const organizationObj = new OrganizationModel();

const handleSocketConnection = async function (socket, io) {
    console.log("a user connected");

    const APcacheKey = `accessPoints:${orgId}`;
    const EScacheKey = `environmentSettings:${orgId}`;

    let accessPoints;
    let environmentSettings;

    try {
        // Try to get access points from cache
        accessPoints = await client.get(APcacheKey);
    } catch (err) {
        logger.error(
            "Error connecting to Redis while fetching access points:",
            err
        );
        accessPoints = null; // Proceed with DB fetch if Redis fails
    }

    try {
        // Try to get environment settings from cache
        environmentSettings = await client.get(EScacheKey);
    } catch (err) {
        logger.error(
            "Error connecting to Redis while fetching environment settings:",
            err
        );
        environmentSettings = null; // Proceed with DB fetch if Redis fails
    }

    // If cache miss, fetch from database and set cache
    if (!accessPoints) {
        logger.info("Cache miss for access points. Fetching from DB...");
        accessPoints = await accessPointObject.findAll(orgId);
        // Try to set it in Redis if it's available
        try {
            await client.set(APcacheKey, JSON.stringify(accessPoints), {
                EX: 86400,
            });
        } catch (err) {
            logger.error("Error setting access points to Redis:", err);
        }
    } else {
        logger.info("Cache hit for access points.");
        accessPoints = JSON.parse(accessPoints);
    }

    if (!environmentSettings) {
        logger.info("Cache miss for environment settings. Fetching from DB...");
        const fetchedSettings = await organizationObj.find(orgId);
        environmentSettings = fetchedSettings.environmentSettings;
        // Try to set it in Redis if it's available
        try {
            await client.set(EScacheKey, JSON.stringify(environmentSettings), {
                EX: 86400,
            });
        } catch (err) {
            logger.error("Error setting environment settings to Redis:", err);
        }
    } else {
        logger.info("Cache hit for environment settings.");
        environmentSettings = JSON.parse(environmentSettings);
    }

    socket.on("sendRssiData", async (beaconsData) => {
        console.log(beaconsData);

        const position = await calculatePositioning(
            beaconsData,
            accessPoints,
            environmentSettings
        );
        socket.emit("position", position);
    });
    socket.on("disconnect", () => {
        console.log("user disconnect");
    });
};
const isAuthSocket = (socket, next) => {
    try {
        const token = socket.handshake.headers.authorization.split(" ")[1];
        const org = jwt.verify(token, jwtSecretKey);
        socket.org = org;
        next();
    } catch (error) {
        next(new Error(error.message));
    }
};

module.exports = { isAuthSocket, handleSocketConnection };
