const {
    measureDistance,
} = require("../algorithms/log-distance/log-distance-model");
const { trilateration } = require("../algorithms/trilateration/trilateration");
const {
    constantsIndoorenviroment,
    referenceRssi,
    coordinatesOfAP,
} = require("../config/env");
const positioning = (req, res, next) => {
    try {
        const beaconsData = req.body;
        for (const beaconName in beaconsData) {
            if (beaconsData.hasOwnProperty(beaconName)) {
                const rssi = beaconsData[beaconName]; // Get the RSSI value

                const distance = measureDistance(
                    rssi,
                    referenceRssi[beaconName],
                    constantsIndoorenviroment.REFERENCE_DISTANCE,
                    constantsIndoorenviroment.PATH_LOSS_EXPONENT,
                    constantsIndoorenviroment.VARIANCE
                );

                coordinatesOfAP[beaconName].d = distance;
            }
        }

        const beacons = Object.entries(coordinatesOfAP).map(([key, value]) => ({
            x: value.x,
            y: value.y,
            distance: value.d,
        }));
        const position = trilateration(beacons);
        return res.status(200).json({
            msg: "positioning success",
            data: { position: position, status: true },
        });
    } catch (error) {
        next(error);
    }
};

module.exports.positioning = positioning;
