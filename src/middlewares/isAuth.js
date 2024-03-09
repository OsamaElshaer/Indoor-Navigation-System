const jwt = require("jsonwebtoken");
const config = require("../config/env");
const CustomError = require("../utils/customError");
const isAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const user = jwt.verify(token, config.jwtSecretKey);
        req.user = user;
        next();
    } catch (error) {
        throw new CustomError("invalid token", 401, error);
    }
};

module.exports.isAuth = isAuth;
