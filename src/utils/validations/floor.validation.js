const { body, param } = require("express-validator");

exports.createFloorValidation = [
    body("floorPlan").custom((value, { req }) => {
        if (!value || typeof value !== "object") {
            throw new Error("FloorData property must be an object");
        }
        return true;
    }),
];
