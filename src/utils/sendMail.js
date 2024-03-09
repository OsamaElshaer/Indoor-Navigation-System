const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");

const { logger } = require("./logger");
const env = require("../config/env");

exports.sendMail = async (emailTo, subject, html) => {
    try {
        let transporter;
        const mailOptions = {
            from: env.email,
            to: emailTo,
            subject: subject,
            html: html,
        };

        if (process.env.NODE_ENV === "test") {
            transporter = nodemailer.createTransport({
                host: "sandbox.smtp.mailtrap.io",
                port: 2525,
                auth: {
                    user: env.mailTrapUser,
                    pass: env.mailTrapPass,
                },
            });
        } else {
            transporter = nodemailer.createTransport(
                sendgridTransport({
                    auth: {
                        api_key: env.sendgridApiKey,
                    },
                })
            );
        }

        const res = await transporter.sendMail(mailOptions);
        console.log(res)
        return true;
    } catch (error) {
        logger.warn("Error sending email:", { error: error.message });
        return true;
    }
};
