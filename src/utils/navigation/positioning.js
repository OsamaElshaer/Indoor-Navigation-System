const { AccessPointModel } = require("../../models/accessPoints.model");
const { OrganizationModel } = require("../../models/organization.model");

const accessPointObject = new AccessPointModel();
const organizationObj = new OrganizationModel();
const {
    measureDistance,
} = require("../../algorithms/log-distance/log-distance-model");

const {
    trilateration,
} = require("../../algorithms/trilateration/trilateration");

async function calculatePositioning(beaconsData, orgId) {
    let beacons = [];
    let APs = await accessPointObject.findAll(orgId);
    let { environmentSettings } = await organizationObj.find(orgId);
    for (const beaconName in beaconsData) {
        const ap = APs.find((ap) => ap.name === beaconName);
        if (beaconsData.hasOwnProperty(beaconName)) {
            const rssi = beaconsData[beaconName];
            const distance = measureDistance(
                rssi,
                ap.metaData["referenceRSSI"],
                ap.metaData["referenceDistance"],
                environmentSettings.pathLossExponent,
                environmentSettings.variance
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
