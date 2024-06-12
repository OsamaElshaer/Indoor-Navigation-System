const { sendMail } = require("../utils/sendMail");
const { validationResult } = require("express-validator");
const CustomError = require("../utils/customError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { audit } = require("../utils/audit");
const crypto = require("crypto");
const generateQr = require("../utils/generateQrCode");
const {
    forgetPasswordTemplate,
    signUpTemplate,
} = require("../utils/mailMessages");
const generateQRCode = require("../utils/generateQrCode");
const { ObjectId } = require("mongodb");

class AuthService {
    constructor(organizationModel) {
        this.organizationModel = organizationModel;
    }

    signUp = async (req, res, next) => {
        try {
            const { organizationData } = req.body;
            organizationData.environmentSettings = {
                pathLossExponent: 2,
                variance: 2,
            };
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new CustomError("signup", 422, errors.array()[0].msg);
            }

            const hashedPassword = await bcrypt.hash(
                organizationData.password,
                12
            );

            organizationData.password = hashedPassword;

            const organizationId = await this.organizationModel.create(
                organizationData
            );

            const subject = "Welcome to Our Application!";
            const html = signUpTemplate(organizationData.adminName);

            sendMail(organizationData.adminEmail, subject, html);

            audit(
                "Organization",
                "Signup",
                organizationData.userName,
                req.method,
                res.statusCode
            );

            return res.status(201).json({
                msg: "Organization signed up successfully",
                data: { organizationId, status: true },
            });
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const organization = req.organization;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new CustomError("login", 422, errors.array()[0].msg);
            }
            const payload = { orgId: organization._id };

            const token = jwt.sign(payload, env.jwtSecretKey, {
                expiresIn: "24h",
            });
            audit(
                "organization",
                "Login",
                organization.userName,
                req.method,
                res.statusCode
            );
            return res.status(201).json({
                msg: "user logged in ",
                data: { token: token, status: true },
            });
        } catch (error) {
            next(error);
        }
    };

    forgetPassword = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new CustomError(
                    "forgetPassword",
                    422,
                    errors.array()[0].msg
                );
            }
            const buffer = await new Promise((resolve, reject) => {
                crypto.randomBytes(32, (err, buffer) => {
                    if (err) {
                        reject(
                            new CustomError(
                                "crypto randomToken",
                                422,
                                err.message
                            )
                        );
                    }
                    resolve(buffer);
                });
            });

            const resetToken = buffer.toString("hex");
            const resestTokenExpire = Date.now() + 600000;
            const passwordResetCount = 0;

            const user = req.user;
            user.token = { resetToken, resestTokenExpire, passwordResetCount };

            await this.organizationModel.update(user._id, user);

            const subject = "Forget Password";
            const html = forgetPasswordTemplate(resetToken);
            const sendMailRes = await sendMail(user.adminEmail, subject, html);

            audit(
                "organization",
                "forget password",
                user.userName,
                req.method,
                res.statusCode
            );
            return res.status(201).json({
                msg: "Check your email to reset your password",
                data: {
                    sendMail: sendMailRes,
                    status: true,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req, res, next) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new CustomError(
                    "resetPassword",
                    422,
                    errors.array()[0].msg
                );
            }
            const { password } = req.body;
            const user = req.user;
            const hashPassword = await bcrypt.hash(password, 12);
            user.password = hashPassword;
            user.token.passwordResetCount++;
            await this.organizationModel.update(user._id, user);
            audit(
                "User",
                "reset password",
                user.userName,
                req.method,
                res.statusCode
            );
            return res.status(201).json({
                msg: " user reset password successfully ",
                data: {
                    status: true,
                },
            });
        } catch (error) {
            next(error);
        }
    };

    generateQr = async (req, res, next) => {
        try {
            let orgId = req.org.orgId;
            let qr = await generateQRCode(orgId);
            let resu = { qr: qr };
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new CustomError("update", 422, errors.array()[0].msg);
            }
            const result = await this.organizationModel.update(orgId, resu);
            return res.status(201).json({
                msg: "QR code has been successfully updated",
                data: { status: result.acknowledged },
            });
        } catch (error) {
            next(error);
        }
    };

    getQrcode = async (req, res, next) => {
        try {
            const orgId = new ObjectId(req.params.orgId);
            const result = await this.organizationModel.find("_id", orgId);
            return res.status(201).json({
                msg: "QR code",
                data: { qrCode: result.qr },
            });
        } catch (error) {
            next();
        }
    };
}

exports.AuthService = AuthService;
