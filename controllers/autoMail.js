// controllers/autoMail.js
const transporter = require("../config/nodemailer");

const autoEmail = async (req, res) => {
    const { subject, body, to, bcc } = req.body;
  
    const mailOptions = {
      from: process.env.USER_EMAIL, // Sender email address
      to: to, // Recipient email addresses
      bcc: bcc, // Blind carbon copy email addresses (hidden from recipients)
      subject: subject, // Email subject
      html: body // Email body (HTML content)
    };
  
    try {
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully to:', to);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  };
  
  module.exports = { autoEmail, transporter };
