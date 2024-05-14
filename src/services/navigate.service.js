const {
    measureDistance,
} = require("../algorithms/log-distance/log-distance-model");
const { trilateration } = require("../algorithms/trilateration/trilateration");

const { AccessPointModel } = require("../models/accessPoints.model");
const { OrganizationModel } = require("../models/organization.model");

const accessPointObject = new AccessPointModel();
const organizationObj = new OrganizationModel();

const positioning = async (req, res, next) => {
    try {
        const beaconsData = req.body;
        let beacons = [];
        let APs = await accessPointObject.findAll(req.org.orgId);
        let { environmentSettings } = await organizationObj.find(
            req.org.orgId
        );
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
        return res.status(200).json({
            msg: "positioning success",
            data: { position: position, status: true },
        });
    } catch (error) {
        next(error);
    }
};

module.exports.positioning = positioning;
