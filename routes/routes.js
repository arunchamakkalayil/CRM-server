const {empReg,empLogin,validateToken} = require('../controllers/formController')
const {deleteData,getData, addData,updateDate, countData} = require("../controllers/dataController")
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

//add data
router.post("/create",addData)

//get data
router.get("/userdata",getData)

// delete item

router.delete("/userdata/:itemId",deleteData)

//update item
router.put('/userdata/:id', updateDate)

//get count
router.get("/count",countData)

module.exports = router