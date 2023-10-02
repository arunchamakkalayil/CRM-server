const {empReg,empLogin,validateToken} = require('../controllers/formController')
const express = require("express")



//router object
const router = new express.Router()

// Routes

// Employee Registration Route.
router.post("/EmployeeRegistration", empReg);

// Employee Login Route.
router.post('/EmployeeLogin', empLogin);

// user valid
router.post("/validateToken",validateToken)

module.exports = router