const mongoose = require("mongoose");

// Customer Schema
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,

  },
  email: {
    type: String,

  },
  phone: {
    type: String,
 
  },
  status: {
    type: String,
 
  },
});



// Creating model
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
