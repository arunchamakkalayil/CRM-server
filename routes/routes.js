const {empReg,empLogin} = require('../controllers/formController')
const express = require("express")
const authenticate = require("../middleware/authenticate")

//router object
const router = new express.Router()

// Routes


// Employee Registration Route.
router.post("/EmployeeRegistration", empReg);

// Employee Login Route.
router.post('/EmployeeLogin', empLogin);

// user valid
router.get("/validuser",authenticate,async(req,res)=>{
console.log("done")
})

module.exports = router