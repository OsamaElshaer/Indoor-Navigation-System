const {
    measureDistance,
} = require("../algorithms/log-distance/log-distance-model");
const { trilateration } = require("../algorithms/trilateration/trilateration");
const {
    constantsIndoorenviroment,
    referenceRssi,
    coordinatesOfAP,
} = require("../config/env");

const handelSocketConnection = function (socket, io) {
    console.log("a user connected");

    socket.on("sendRssiData", (rssiData) => {
        console.log(rssiData);

        rssiData.forEach((elements) => {
            const beaconName = Object.keys(elements)[0]; // Get the beacon name
            const rssi = Object.values(elements)[0]; // Get the RSSI value

            const distance = measureDistance(
                rssi,
                referenceRssi[beaconName],
                constantsIndoorenviroment.REFERENCE_DISTANCE,
                constantsIndoorenviroment.PATH_LOSS_EXPONENT,
                constantsIndoorenviroment.VARIANCE
            );

            coordinatesOfAP[beaconName].d = distance;
        });
        const beacons = Object.entries(coordinatesOfAP).map(([key, value]) => ({
            x: value.x,
            y: value.y,
            distance: value.d,
        }));
        const position = trilateration(beacons);
        socket.emit("position", position);
    });
};

module.exports = handelSocketConnection;
