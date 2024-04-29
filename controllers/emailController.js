// controllers/emailController.js
const transporter = require('../config/nodemailer');

const sendEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({
      from: '"Interview Mail" <testd9233@gmail.com>',
      to: to,
      subject: subject,
      html: html,
    });
    console.log('Email sent successfully to:', to);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

module.exports = { sendEmail };
