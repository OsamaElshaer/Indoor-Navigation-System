const express = require("express");
const router = express.Router();
const { AuthService } = require("../../services/auth.service");
const { UserModel } = require("../../models/user.model");
const {
    validateSignup,
    validateLogin,
    valiadteforgetPassword,
    validateResetPassword,
} = require("../../utils/validations");

const userModel = new UserModel();
const userService = new AuthService(userModel);

const { signUp, login, forgetPassword, resetPassword } = userService;

router.post("/signup", validateSignup, signUp);
router.post("/login", validateLogin, login);
router.post("/forgetPassword", valiadteforgetPassword, forgetPassword);
router.post("/resetPassword/:resetToken", validateResetPassword, resetPassword);

module.exports.userRouter = router;
