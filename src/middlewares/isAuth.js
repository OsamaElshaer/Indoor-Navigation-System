const jwt = require("jsonwebtoken");
const { jwtSecretKey } = require("../config/env");
const CustomError = require("../utils/customError");
const isAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const org = jwt.verify(token, jwtSecretKey);
        req.org = org;
        next();
    } catch (error) {
        throw new CustomError("invalid token", 401, error);
    }
};

module.exports.isAuth = isAuth;
