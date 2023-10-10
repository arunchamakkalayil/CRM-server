const EmployeeRegistration = require("../models/EmployeeRegistration Model");
const Customer = require("../models/Customerdata");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keysecret = "keyfortokensecret";

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
    const decodedToken = jwt.verify(token, keysecret);

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




module.exports = { empReg, empLogin, validateToken };
