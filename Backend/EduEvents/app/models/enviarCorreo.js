const nodemailer = require('nodemailer');
const envCorreoConfig = require("../config/envemail.config.js");

const transport = nodemailer.createTransport({
    host: envCorreoConfig.host,
    port: envCorreoConfig.host,
    secure: envCorreoConfig.secure,
    auth: {
    user: envCorreoConfig.user,
    pass: envCorreoConfig.pass
    }
});

module.exports = transport;