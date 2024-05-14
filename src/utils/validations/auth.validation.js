const { body, param } = require("express-validator");
const bcrypt = require("bcrypt");
const { OrganizationModel } = require("../../models/organization.model");
const organizationModel = new OrganizationModel();

exports.validateSignup = [
    body("organizationData.organizationName")
        .trim()
        .isLength({ min: 5 })
        .withMessage("Organization name is required"),

    body(
        "organizationData.contactEmail",
        "Please enter a valid contact email address"
    )
        .isEmail()
        .normalizeEmail(),

    body("organizationData.contactPhone")
        .matches(/^\d{3}-\d{3}-\d{4}$/)
        .withMessage("Invalid phone number format (e.g., 123-456-7890)"),

    body("organizationData.adminName")
        .trim()
        .isLength({ min: 1 })
        .withMessage("Admin name is required"),

    body(
        "organizationData.adminEmail",
        "Please enter a valid admin email address"
    )
        .isEmail()
        .normalizeEmail(),

    body("organizationData.adminPhone")
        .matches(/^\d{3}-\d{3}-\d{4}$/)
        .withMessage("Invalid admin phone number format (e.g., 987-654-3210)"),

    body("organizationData.userName")
        .trim()
        .isLength({ min: 4 })
        .withMessage("Username must be at least 4 characters long")
        .matches("^[0-9a-zA-Z]+$", "i")
        .withMessage("Invalid username (alphanumeric characters only)")
        .custom(async (value) => {
            const organization = await organizationModel.find(
                "userName",
                value
            );
            if (organization) {
                throw new Error("Organization already exists");
            }
            return true;
        }),

    body("organizationData.password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one digit")
        .matches(/[!@#$%^&*]/)
        .withMessage("Password must contain at least one special character"),

    body("organizationData.organizationType")
        .isIn(["Business", "Non-profit", "Government"])
        .withMessage(
            "Invalid organization type (must be Business, Non-profit, or Government)"
        ),
];

exports.validateLogin = [
    body("userName")
        .matches("^[0-9a-zA-Z ]+$", "i")
        .withMessage("Invalid username")
        .custom(async (value, { req }) => {
            const organization = await organizationModel.find(
                "userName",
                value
            );
            if (!organization) {
                throw new Error("User does not exist");
            }
            req.organization = organization;
            return true;
        }),
    body("password")
        .isLength({ min: 8 })
        .withMessage("Invalid password")
        .custom(async (value, { req }) => {
            const organization = req.organization;
            const result = await bcrypt.compare(value, organization.password);
            if (!result) {
                throw new Error("Incorrect password");
            }
            return true;
        }),
];
exports.valiadteforgetPassword = [
    body("email", "Please enter a valid email address")
        .isEmail()
        .normalizeEmail()
        .custom(async (value, { req }) => {
            const user = await organizationModel.find("adminEmail", value);
            if (!user) {
                throw new Error("There is no user with this email");
            }
            req.user = user;
            return true;
        }),
];

exports.validateResetPassword = [
    param("resetToken").custom(async (value, { req }) => {
        const user = await organizationModel.find({
            "token.resetToken": value,
        });
        if (
            !user ||
            Date.now() > user.token.resetTokenExpire ||
            user.token.passwordResetCount > 1
        ) {
            throw new Error("Token is not valid");
        }
        req.user = user;
    }),

    body("password")
        .isLength({ min: 8 })
        .withMessage("Password must be at least 8 characters long")
        .matches(/[a-z]/)
        .withMessage("Password must contain at least one lowercase letter")
        .matches(/[A-Z]/)
        .withMessage("Password must contain at least one uppercase letter")
        .matches(/[0-9]/)
        .withMessage("Password must contain at least one digit")
        .matches(/[!@#$%^&*]/)
        .withMessage("Password must contain at least one special character")
        .custom((value, { req }) => {
            if (value !== req.body.passwordConfirmation) {
                throw new Error("Password confirmation is incorrect");
            }
            return true;
        }),
];
