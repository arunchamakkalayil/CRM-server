const EmployeeRegistration = require("../models/EmployeeRegistration Model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require('uuid');
const transporter = require('../config/nodemailer');
//Employee Registration

empReg = async (req, res) => {
  const { name, empid, email, password, phone } = req.body;

  if (!name || !empid || !email || !password || !phone) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    const existingUser = await EmployeeRegistration.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Generate verification token
    const verificationToken = uuidv4();

    // Hashing password
    const hashedPass = await bcrypt.hash(password, 10);
    console.log("Password hashed");

    // Create new employee instance
    const newEmployee = new EmployeeRegistration({
      name,
      empid,
      email,
      password: hashedPass,
      phone,
      verificationToken,
    });
console.log(verificationToken)
    // Save the new employee
    await newEmployee.save();

    // Send verification email
    const verificationLink = `http://localhost:3000/verify-email/${verificationToken}`;
    await sendVerificationEmail(newEmployee.email, verificationLink);

    // Send response
    res.status(201).json({ message: "Registration successful" });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ message: "Error during registration" });
  }
};

// Function to send verification email
const sendVerificationEmail = async (email, verificationLink) => {
  try {
    await transporter.sendMail({
      from:'"LeadTracker" <noreply@example.com>',
      to: email,
      subject: "Email Verification",
      html: `Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a>`,
    });
    console.log("Verification email sent");
  } catch (error) {
    console.error("Error sending verification email:", error);
  }
};
//Employee Login

//Employee Login
empLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    // Find the user by email
    const user = await EmployeeRegistration.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);

    
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    // Check if the user's email is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Email is not verified" });
    }




    // generate token
    const token = await user.generateAuthtoken();

    // Generate cookie
    res.cookie("usercookie", token, {
      expires: new Date(Date.now() + 9000000),
      httpOnly: true,
    });

    const result = {
      user,
      token,
    };

    return res.status(200).json({ message: "Login successful", result });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


verifyEmail = async (req, res) => {
  
  try {
    const { token } = req.params;
console.log("Token",token)
    // Find the user by verification token
    const user = await EmployeeRegistration.findOne({ verificationToken: token });
console.log(user)
    // If user is found, update isVerified field to true
    if (user) {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({message:"successful"})
     
       
    } else {
      return res.status(404).json({ message: 'Invalid verification token' });
    }
  } catch (error) {
    console.error('Error verifying email:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}


validateToken = async (req, res) => {
  // Get the token from the Authorization header
  const authHeader = req.headers.authorization;
  console.log(authHeader);
  // Check if the Authorization header is present
  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  // Extract the token from the Authorization header (assuming it's in the format "Bearer <token>")
  const token = authHeader.split(" ")[1];

  try {
    // Verify and decode the token
    const decodedToken = jwt.verify(token, process.env.SECRET);

    // If verification is successful, you can access claims
    console.log(decodedToken);

    // Continue with your token validation logic here...

    // If validation is successful, send a success response
    res.status(200).json({ message: "Token is valid" });
  } catch (error) {
    // If verification fails, send an error response
    console.error("Error validating token:", error);
    res.status(401).json({ message: "Token is invalid" });
  }
};




module.exports = { empReg, empLogin, validateToken, verifyEmail };
