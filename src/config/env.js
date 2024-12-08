const dotenv = require("dotenv");
dotenv.config();

const {
    PORT,
    WHITE_LIST,
    EMAIL,
    DB_HOST,
    NODEMAILER_USER,
    NODEMAILER_PASS,
    JWT_SECRET_KEY,
    SENDGRID_API_KEY,
    MAILTRAP_USER,
    MAILTRAP_PASS,
    CONSTANTS_INDOOR_ENVIROMENT,
    REFERENCE_RSSI,
    COORDINATES_OF_AP,
    SERVER_URL,
    REDIS_HOST,
} = process.env;
module.exports = {
    port: PORT,
    whiteList: WHITE_LIST,
    email: EMAIL,
    dbHost: DB_HOST,
    redisHost: REDIS_HOST,
    nodemailerUser: NODEMAILER_USER,
    nodemailerPass: NODEMAILER_PASS,
    jwtSecretKey: JWT_SECRET_KEY,
    sendgridApiKey: SENDGRID_API_KEY,
    mailTrapUser: MAILTRAP_USER,
    mailTrapPass: MAILTRAP_PASS,
    constantsIndoorenviroment: JSON.parse(CONSTANTS_INDOOR_ENVIROMENT),
    referenceRssi: JSON.parse(REFERENCE_RSSI),
    coordinatesOfAP: JSON.parse(COORDINATES_OF_AP),
    serverUrl: SERVER_URL,
};
