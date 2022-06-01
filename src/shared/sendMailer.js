const nodemailer = require('nodemailer');
const { getConfig } = require('../config');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

exports.sendMail = async (token) => {
    const transport = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: getConfig().sendEmail.nodemailerUser,
            pass: getConfig().sendEmail.nodemailerPath
        }
    });

    const res = await transport.sendMail({
        from: getConfig().sendEmail.nodemailerUser,
        to: 'tuhanov.maksym@gmail.com',
        subject: 'Confirm your email!',
        html: `<a href='http://localhost:3000/api/users/verify/${token}'>Follow the link</a>`
    });
    console.log(res);
}