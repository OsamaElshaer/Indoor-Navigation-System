const { calculatePositioning } = require("../utils/navigation/positioning");
const { FloorModel } = require("../models/floor.model");
const geoJsonToMatrix = require("../utils/navigation/geoJsonToMatrix");
const aStar = require("../utils/navigation/aStar");
const floorObject = new FloorModel();

exports.positioning = async (req, res, next) => {
    try {
        const beaconsData = req.body;
        const position = await calculatePositioning(beaconsData, req.org.orgId);
        return res.status(200).json({
            msg: "positioning success",
            data: { position: position, status: true },
        });
    } catch (error) {
        next(error);
    }
};

exports.routing = async (req, res, next) => {
    try {
        let { start, end } = req.body;
        let orgId = req.org.orgId;
        let map = await floorObject.find(orgId);
        let matrix = geoJsonToMatrix(map);
        let shortestPath = aStar(matrix, start, end);
        return res.json({ status: "success", data: shortestPath });
    } catch (error) {
        next(error);
    }
};
