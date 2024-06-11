const express = require("express");
const router = express.Router();
const { AuthService } = require("../../services/auth.service");
const { OrganizationModel } = require("../../models/organization.model");
const {
    validateSignup,
    validateLogin,
    valiadteforgetPassword,
    validateResetPassword,
} = require("../../utils/validations/auth.validation");
const { isAuth } = require("../../middlewares/isAuth");

const organizationModel = new OrganizationModel();
const authService = new AuthService(organizationModel);

const { signUp, login, forgetPassword, resetPassword, generateQr, getQrcode } =
    authService;

router.post("/signup", validateSignup, signUp);
router.post("/login", validateLogin, login);
router.post("/forgetPassword", valiadteforgetPassword, forgetPassword);
router.post("/resetPassword/:resetToken", validateResetPassword, resetPassword);
router.post("/resetPassword/:resetToken", validateResetPassword, resetPassword);
router.put("/generateQr", isAuth, generateQr);
router.get("/qrCode", getQrcode);

module.exports.organizationRouter = router;
