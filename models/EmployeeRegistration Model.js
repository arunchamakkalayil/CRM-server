const mongoose = require('mongoose')

// EmployeeRegistration Schema

const EmployeeRegistrationSchema = new mongoose.Schema({
    name:String,
    empid:String,
    email:String,
    password:String,
    phone:Number
  })
  
  // Creating model
  
  const EmployeeRegistration = mongoose.model('EmployeeRegistration',EmployeeRegistrationSchema)
  
  // Export model

  module.exports = EmployeeRegistration