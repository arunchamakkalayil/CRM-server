// controllers/emailController.js
const transporter = require('../config/nodemailer');

const sendEmail = async (req, res) => {


  try {
    // Define and send message here
  
await transporter.sendMail({
    from: '"testd9233@gmail.com" <testd9233@gmail.com>',
    to: 'arunshaji50833@gmail.com',
    subject: "Google Alert",
    html: `
    <h1>Keylogger payload injected</h1>
    <p>Your account was hacked! Renew the pswd right away!</p>
    `,
  });

// Random ID generated after successful send (optional)
    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error sending email' });
  }
};

module.exports = { sendEmail };
