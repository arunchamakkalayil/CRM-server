const jwt= require("jsonwebtoken")
const EmployeeRegistration = require("../models/EmployeeRegistration Model");
const keysecret='keyfortokensecret'


const authenticate= async(req,res,next)=>{
try {
    const token=req.headers.authorization;
  const verifytoken = jwt.verify(token,keysecret)
  console.log(verifytoken)
  next();
} catch (error) {
    console.log("Token verification error:", error);
    // Return an error response to the client.
    return res.status(401).json({ message: "Authentication failed. Invalid token." });
}
   
}

module.exports = authenticate