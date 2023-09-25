const EmployeeRegistration = require('../models/EmployeeRegistration Model');
const bcrypt = require('bcrypt');

empReg = async(req, res) => {
 
    const { name, empid, email, password, phone } = req.body;
  const existingUser = await EmployeeRegistration.findOne({phone})
  if (existingUser) {
    return res.status(400).json({ message: 'User with this number already exists' });
  }
    // Hashing password
    bcrypt
      .hash(password, 10)
      .then((hashedPass) => {
        console.log(hashedPass,"Password hashed")
        const newEmployee = new EmployeeRegistration({
          name,
          empid,
          email,
          password: hashedPass,
          phone,
        });
        return newEmployee.save();
      })
      .then(() => {
        res.status(201).json({ message: "saved successfully" });
      })
      .catch((err) => {
        // Handle errors
        // console.error('Error:', err);
        res.status(500).json({ message: "Error saving employee registration" });
      });
  }

  module.exports={empReg}