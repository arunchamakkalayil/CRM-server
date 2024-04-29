const EmployeeRegistration = require("../models/EmployeeRegistration Model");
const PasswordReset = require("../models/PasswordReset");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { v4: uuidv4 } = require("uuid");
const transporter = require("../config/nodemailer");
//Employee Registration

empReg = async (req, res) => {
  const { name, empid, email, password, phone } = req.body;

  if (!name || !empid || !email || !password || !phone) {
    return res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    // Check if user with email exists
    const existingUser = await EmployeeRegistration.findOne({ email: email });
    if (existingUser) {
      // If email is already verified, return user already exists error
      if (existingUser.isVerified) {
        return res
          .status(400)
          .json({ message: "User with this email already exists" });
      } else {
        // Update existing user data with new information
        existingUser.name = name;
        existingUser.empid = empid;
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.phone = phone;
        existingUser.verificationToken = uuidv4(); // Generate new verification token
        await existingUser.save();

        // Send verification email with new verification link
        const verificationLink = `${process.env.BASE_URL}/verify-email/${existingUser.verificationToken}`;
        await sendVerificationEmail(existingUser.email, verificationLink);

        return res.status(200).json({ message: "User updated. Please verify your email." });
      }
    }

    // Generate verification token
    const verificationToken = uuidv4();

    // Hashing password
    const hashedPass = await bcrypt.hash(password, 10);
    
    // Create new employee instance
    const newEmployee = new EmployeeRegistration({
      name,
      empid,
      email,
      password: hashedPass,
      phone,
      verificationToken,
    });

    // Save the new employee
    await newEmployee.save();

    // Send verification email
    const verificationLink = `${process.env.BASE_URL}/verify-email/${verificationToken}`;
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
      from: '"LeadTracker" <noreply@example.com>',
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
    
    // Check if the user's email is verified
    if (!user.isVerified) {

          // Generate verification token
    const verificationTokenLogin = uuidv4();
// Save verification token to user document
user.verificationToken = verificationTokenLogin;
await user.save();

    
    // Send verification email
    const verificationLink = `${process.env.BASE_URL}/verify-email/${verificationTokenLogin}`;
    await sendVerificationEmail(email, verificationLink);
      // If email is not verified
      return res.status(403).json({ message: "Email is not verified. Please verify your email before logging in." });

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
    console.log("Token", token);
    // Find the user by verification token
    const user = await EmployeeRegistration.findOne({
      verificationToken: token,
    });
    console.log(user);
    // If user is found, update isVerified field to true
    if (user) {
      user.isVerified = true;
      await user.save();
      return res.status(200).json({ message: "successful" });
    } else {
      return res.status(404).json({ message: "Invalid verification token" });
    }
  } catch (error) {
    console.error("Error verifying email:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

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

// Function to generate reset token
const generateResetToken = (email) => {
  return jwt.sign({ email }, process.env.SECRET, { expiresIn: "5m" });
};

// Function to send reset password email
const sendResetPasswordEmail = async (email, resetLink) => {
  try {
    await transporter.sendMail({
      from: '"LeadTracker" <noreply@example.com>',
      to: email,
      subject: "Reset Password",
      html: `Click the following link to reset your password: <a href="${resetLink}">${resetLink}</a><br>Link will expire in 5 minutes`,
    });
    console.log("Reset password email sent");
  } catch (error) {
    console.error("Error sending reset password email:", error);
    throw new Error("Failed to send reset password email");
  }
};

// Reset Password
resetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find the user by email
    const user = await EmployeeRegistration.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate reset token with 5-minute expiry
    const resetToken = generateResetToken(email);
    console.log(resetToken);
    // Save reset token to user document
    user.resetToken = resetToken;
    user.resetTokenExpiry = Date.now() + 300000; // 5 minutes expiry
    await user.save();
    // Save reset token and expiry time to passwordreset table
    await saveResetTokenToDB(
      email,
      resetToken,
      new Date(user.resetTokenExpiry)
    );

    // Construct reset link
    const resetLink = `${process.env.BASE_URL}/reset-password/${resetToken}`;

    // Send reset password email
    await sendResetPasswordEmail(email, resetLink);

    return res
      .status(200)
      .json({ message: "Link to reset password was sent to your mail" });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res
      .status(500)
      .json({ message: "Failed to reset password. Please try again later." });
  }
};
// Function to save reset token to database
// Function to save reset token to database
const saveResetTokenToDB = async (email, resetToken, expiry) => {
  try {
    const passwordReset = new PasswordReset({
      email,
      token: resetToken, // Include the token field
      resetTokenExpiry: expiry,
    });
    await passwordReset.save();
    console.log("Reset token saved to database");
  } catch (error) {
    console.error("Error saving reset token to database:", error);
    throw error;
  }
};

validateTokenReset = async (req, res) => {
  const { token } = req.params;
  console.log("Token", token);

  try {
    // Find the token in the database
    const resetToken = await PasswordReset.findOne({ token });
console.log(resetToken)
    if (resetToken) {
      // Token found, check if it's expired
      if (resetToken.expiry < Date.now()) {
        return res.status(400).json({ message: "Reset token has expired" });
      } else {
        // Token is valid, include user ID and expiration time in the response
        return res.status(200).json({ 
          message: "Reset token is valid",
          userId: resetToken.userId,
          expiresAt: resetToken.expiresAt
        });
      }
    } else {
      // Token not found in database
      return res.status(404).json({ message: "Reset token not found" });
    }
  } catch (error) {
    console.error("Error validating reset token:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// newPassword controller function
newPassword = async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    // Find the reset token in the database
    const resetToken = await PasswordReset.findOne({ token });

    // Check if the token exists and is not expired
    if (resetToken && resetToken.expiry > Date.now()) {
      // Find all reset tokens with the same email address
      const resetTokens = await PasswordReset.find({ email: resetToken.email });

      // Iterate through the reset tokens
      for (const resetToken of resetTokens) {
        // Check if the token is expired
        if (resetToken.expiry < Date.now()) {
          // Delete the expired token from the database
          await PasswordReset.deleteOne({ _id: resetToken._id });
        }
      }

      // Find the user by email
      const user = await EmployeeRegistration.findOne({ email: resetToken.email });

      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Check if passwords match
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "Passwords do not match" });
      }

      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Update the user's password
      user.password = hashedPassword;

      // Save the updated user
      await user.save();

      // Delete the reset token from the database
      await PasswordReset.deleteOne({ _id: resetToken._id });

      return res.status(200).json({ message: "Password reset successful" });
    } else {
      // Token not found or expired
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};





module.exports = {
  empReg,
  empLogin,
  validateToken,
  verifyEmail,
  resetPassword,
  newPassword,
  validateTokenReset,
};
