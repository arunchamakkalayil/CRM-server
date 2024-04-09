const {empReg,empLogin,validateToken,verifyEmail} = require('../controllers/formController')
const {deleteData,getData, addData,updateDate,addExcel, countData,monthCount} = require("../controllers/dataController")
const {addScheduleData,getScheduleData,updateSchedule,deleteSchedule} = require('../controllers/scheduleController')
const {autoEmail}=require('../controllers/autoMail')
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

//add excel data
router.post("/excelData",addExcel)

//add leads data
router.post("/addData",addData)

//get leads data
router.get("/userdata",getData)

// delete leads 

router.delete("/userdata/:itemId",deleteData)

//update leads item
router.put('/userdata/:id', updateDate)

// leads count
router.get("/count",countData)

// add schedules
router.post("/scheduleform",addScheduleData)

// get schedules
router.get("/schedule",getScheduleData)

// upt schedule
router.put('/schedule/:id', updateSchedule)

// Delete scheduled item route
router.delete('/schedule/:id', deleteSchedule);

//send email
router.post('/email',autoEmail)

//monthcount
router.get('/monthCount',monthCount)


// Define the verification endpoint
// Define the verification endpoint
router.get('/verify-email/:token', verifyEmail);


module.exports = router