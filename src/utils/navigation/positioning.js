const {
    measureDistance,
} = require("../../algorithms/log-distance/log-distance-model");

const {
    trilateration,
} = require("../../algorithms/trilateration/trilateration");

async function calculatePositioning(beaconsData, APs, envSet) {
    let beacons = [];
    for (const beaconName in beaconsData) {
        const ap = APs.find((ap) => ap.name === beaconName);
        if (beaconsData.hasOwnProperty(beaconName)) {
            const rssi = beaconsData[beaconName];
            const distance = measureDistance(
                rssi,
                ap.metaData["referenceRSSI"],
                ap.metaData["referenceDistance"],
                envSet.pathLossExponent,
                envSet.variance
            );
            const c = ap["coordinates"];
            c.distance = distance;
            beacons.push(c);
        }
    }

    const position = trilateration(beacons);
    return position;
}

module.exports.calculatePositioning = calculatePositioning;
