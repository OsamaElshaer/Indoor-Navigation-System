const { jwtSecretKey } = require("../config/env");
const jwt = require("jsonwebtoken");
const {
    measureDistance,
} = require("../algorithms/log-distance/log-distance-model");
const { trilateration } = require("../algorithms/trilateration/trilateration");

const { AccessPointModel } = require("../models/accessPoints.model");
const { OrganizationModel } = require("../models/organization.model");
const { ObjectId } = require("mongodb");

const accessPointObject = new AccessPointModel();
const organizationObj = new OrganizationModel();

const handleSocketConnection = async function (socket, io) {
    console.log("a user connected");

    let APs = await accessPointObject.findAll(new ObjectId(socket.org.orgId));
    let { environmentSettings } = await organizationObj.find(
        new ObjectId(socket.org.orgId)
    );
    socket.on("sendRssiData", (beaconsData) => {
        console.log(beaconsData);
        let beacons = [];

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
