/**
 * Created by Leo on 3/10/2018.
 */

const nodemailer = require('nodemailer');
const config = require('../../config.json');

var EmailService = function () {};

EmailService.prototype.sendEmail = (data) => {
  return new Promise((resolve, reject) => {
    if (!data.name || !data.email || !data.message) {
      return reject(new Error('All fields must be filled'));
    }

    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
      from: `"${data.name}" <${data.email}>`,
      to: config.mail.smtp.auth.user,
      subject: 'New application through contact form',
      text: data.message.trim().slice(0, 500) +
      `\n Sent by: <${data.email}>`
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error)
        return reject(new Error(`Error occurred while sending email ${error.message}`));
      resolve();
    });
  });
};

module.exports = new EmailService();
