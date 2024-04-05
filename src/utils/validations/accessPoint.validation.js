const { body, param } = require("express-validator");

exports.addAPvalidation = [
    body("name").isString().notEmpty(),
    body("coordinates").isObject().notEmpty(),
    body("coordinates.x").isNumeric(),
    body("coordinates.y").isNumeric(),
    body("coordinates.z").isNumeric(),
];

exports.findAPvalidation = [param("key").notEmpty().isString()];

exports.UpdateAPvalidation = [
    body("_id").notEmpty().isMongoId(),
    body("name").optional().isString(),
    body("coordinates").optional().isObject(),
];

exports.deleteValidator = [param("_id").notEmpty().isMongoId()];
