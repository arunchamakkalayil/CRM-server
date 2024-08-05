const mongoose = require('mongoose');

// Define the schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  place: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});

// Create the model
const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
