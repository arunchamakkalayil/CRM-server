const {empReg} = require('../controllers/formController')
const express = require("express")

//router object
const router = new express.Router()

// Routes

// Employee Registration Form Route
router.post("/EmployeeRegistration", empReg);

// Employee Login Form Route



module.exports = router