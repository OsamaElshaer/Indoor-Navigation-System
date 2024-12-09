const { calculatePositioning } = require("../utils/navigation/positioning");
const { FloorModel } = require("../models/floor.model");
const geoJsonToMatrix = require("../utils/navigation/geoJsonToMatrix");
const aStar = require("../utils/navigation/aStar");
const floorObject = new FloorModel();
const { client } = require("../loaders/redis");

const { AccessPointModel } = require("../models/accessPoints.model");
const { OrganizationModel } = require("../models/organization.model");
const { logger } = require("../utils/logger");

const accessPointObject = new AccessPointModel();
const organizationObj = new OrganizationModel();

exports.positioning = async (req, res, next) => {
    try {
        const beaconsData = req.body;
        const orgId = req.org.orgId;

        const APcacheKey = `accessPoints:${orgId}`;
        const EScacheKey = `environmentSettings:${orgId}`;

        let accessPoints;
        let environmentSettings;

        try {
            accessPoints = await client.get(APcacheKey);
        } catch (err) {
            logger.error(
                "Error connecting to Redis while fetching access points:",
                err
            );
            accessPoints = null;
        }

        try {
            environmentSettings = await client.get(EScacheKey);
        } catch (err) {
            logger.error(
                "Error connecting to Redis while fetching environment settings:",
                err
            );
            environmentSettings = null;
        }

        if (!accessPoints) {
            logger.info("Cache miss for access points. Fetching from DB...");
            accessPoints = await accessPointObject.findAll(orgId);
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
            logger.info(
                "Cache miss for environment settings. Fetching from DB..."
            );
            const fetchedSettings = await organizationObj.find(orgId);
            environmentSettings = fetchedSettings.environmentSettings;
            try {
                await client.set(
                    EScacheKey,
                    JSON.stringify(environmentSettings),
                    { EX: 86400 }
                );
            } catch (err) {
                logger.error(
                    "Error setting environment settings to Redis:",
                    err
                );
            }
        } else {
            logger.info("Cache hit for environment settings.");
            environmentSettings = JSON.parse(environmentSettings);
        }

        const position = await calculatePositioning(
            beaconsData,
            accessPoints,
            environmentSettings
        );

        return res.status(200).json({
            msg: "Positioning success",
            data: { position, status: true },
        });
    } catch (error) {
        next(error);
    }
};

exports.routing = async (req, res, next) => {
    try {
        let { start, end } = req.body;
        let orgId = req.org.orgId;
        const cacheKey = `map:${orgId}`;

        let map = await client.get(cacheKey);

        if (!map) {
            logger.info("Cache miss for map. Fetching from DB...");
            try {
                map = await floorObject.find("orgId", orgId);
                await client.set(cacheKey, JSON.stringify(map), { EX: 86400 });
            } catch (dbError) {
                logger.error("Error fetching map from DB:", dbError);
                return next(dbError);
            }
        } else {
            logger.info("Cache hit for map.");
            map = JSON.parse(map);
        }

        const matrix = geoJsonToMatrix(map);
        const shortestPath = aStar(matrix, start, end);

        return res.status(200).json({
            message: "Routing success",
            data: { shortestPath, status: true },
        });
    } catch (error) {
        logger.error("Error in routing:", error);
        next(error);
    }
};
