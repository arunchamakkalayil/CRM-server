const EmployeeRegistration = require("../models/EmployeeRegistration Model");
const bcrypt = require("bcryptjs");

//Employee Registration

empReg = async (req, res) => {
  const { name, empid, email, password, phone } = req.body;

  if (!name || !empid || !email || !password || !phone) {
    res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    const existingUser = await EmployeeRegistration.findOne({ email: email });
    if (existingUser) {
      res.status(400).json({ message: "User with this email already exists" });
    } else {
      // Hashing password
      bcrypt
        .hash(password, 10)
        .then((hashedPass) => {
          console.log("Password hashed");
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
          console.error("Error:", err);
          res
            .status(500)
            .json({ message: "Error saving employee registration" });
        });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log("err in catch", err);
  }
};

//Employee Login

empLogin = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);

  if (!email || !password) {
    res.status(422).json({ error: "Please fill all fields" });
  }

  try {
    const validUser = await EmployeeRegistration.findOne({ email });
    if (validUser) {
      const isMatch = await bcrypt.compare(password, validUser.password);
      if (isMatch) {
        // generate tokon
        const token = await validUser.generateAuthtoken();

        // generatecookie

        res.cookie("usercookie", token, {
          expires: new Date(Date.now() + 9000000),
          httpOnly: true,
        });

        const result = {
          validUser,
          token,
        };
        res.status(201).json({ message: 201, result });
      } else {
        res.status(400).json({ message: "Invalid Password" });
      }
    } else {
      res.status(501).json({ message: "User not found" });
    }
  } catch (err) {
    res.status(500).json(err);
    console.log("err in catch", err);
  }
};


module.exports = { empReg, empLogin };
