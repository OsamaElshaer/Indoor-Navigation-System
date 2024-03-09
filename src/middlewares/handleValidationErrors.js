const { validationResult } = require("express-validator");
const CustomError = require("../utils/customError");

exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const validationErrors = errors.array().map((error) => error.msg);
        throw new CustomError("Validation Error", 422, validationErrors);
    }
    next();
};
