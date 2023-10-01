const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");

// EmployeeRegistration Schema

const keysecret = "keyfortokensecret";

const EmpRegSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  empid: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not Valid Email");
      }
    },
  },
  password: {
    type: String,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
});

// /token generation
EmpRegSchema.methods.generateAuthtoken = async function () {
  try {
    let tokenGen = jwt.sign({ _id: this._id }, keysecret, {
      expiresIn: "1d",
    });

    this.tokens = this.tokens.concat({ token: tokenGen });
    await this.save();
    console.log(tokenGen);
    return tokenGen;
  } catch (error) {
    console.log(error);
    res.status(422).json(error);
  }
};

// Creating model

const EmployeeRegistration = mongoose.model(
  "EmployeeRegistration",
  EmpRegSchema
);

// Export model

module.exports = EmployeeRegistration;
