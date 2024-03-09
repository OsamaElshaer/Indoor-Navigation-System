const { sendMail } = require("../utils/sendMail");
const { validationResult } = require("express-validator");
const CustomError = require("../utils/customError");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const env = require("../config/env");
const { audit } = require("../utils/audit");
const crypto = require("crypto");
const {
    forgetPasswordTemplate,
    signUpTemplate,
} = require("../utils/mailMessages");

class AuthService {
    constructor(userModel) {
        this.userModel = userModel;
    }
    signUp = async (req, res, next) => {
        try {
            const { userName, email, password } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new CustomError("signup", 422, errors.array()[0].msg);
            }
            const hashedPassword = await bcrypt.hash(password, 12);
            const userId = await this.userModel.create(
                userName,
                email,
                hashedPassword
            );
            //send mail
            const subject = "Welcome to Our Application!";
            const html = signUpTemplate(userName);

            sendMail(email, subject, html);

            audit(
                "User",
                "Signup",
                userName,

                req.method,
                res.statusCode
            );
            return res.status(201).json({
                msg: "User signed up successfully",
                data: { userId: userId, status: true },
            });
        } catch (error) {
            next(error);
        }
    };
    login = async (req, res, next) => {
        try {
            const user = req.user;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                throw new CustomError("login", 422, errors.array()[0].msg);
            }
            const payload = { userId: user._id, userName: user.userName };

            const token = jwt.sign(payload, env.jwtSecretKey, {
                expiresIn: "24h",
            });
            audit("User", "Login", user.userName, req.method, res.statusCode);
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

            await this.userModel.update(user._id, user);

            const subject = "Forget Password";
            const html = forgetPasswordTemplate(resetToken);
            const sendMailRes = await sendMail(user.email, subject, html);

            audit(
                "User",
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
            await this.userModel.update(user._id, user);
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
}

exports.AuthService = AuthService;
