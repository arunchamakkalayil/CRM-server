const mongoose = require('mongoose');

// Define the schema for the password reset tokens
const passwordResetSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
    default: () => new Date(+new Date() + 5 * 60 * 1000), // Set expiry to 5 minutes from the current time
  },
});

// Create a Mongoose model for password reset tokens using the schema
const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema);

module.exports = PasswordReset;
