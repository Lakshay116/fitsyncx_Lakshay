const { text } = require('body-parser');
const nodemailer = require('nodemailer');
const { errorMonitor } = require('nodemailer/lib/xoauth2');
require('dotenv').config();
const { SMTP_MAIL, SMTP_PASSWORD } = process.env;


const sendMail = async (email, mailSubject, content) => {
    try {
        var transport = await nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: SMTP_MAIL,
                pass: SMTP_PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.SMTP_MAIL,
            to: email,
            subject: mailSubject,
            html: content
        }
        transport.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log("mail Sent Succesfully", info.response);
            }
        })
    } catch (error) {
        console.log(error.message);
    }
}

module.exports = sendMail;