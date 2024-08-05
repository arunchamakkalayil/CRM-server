const mongoose = require("mongoose");

// Customer Schema
const customerSchema = new mongoose.Schema({
  item: {
    type: String,
   

  },
  quantity: {
    type: Number,

  },
  phone: {
    type: String,
 
  },
  place:{
    type:String,
  },
  status: {
    type: String,
 
  },
});



// Creating model
const Customer = mongoose.model("Customer", customerSchema);

module.exports = Customer;
