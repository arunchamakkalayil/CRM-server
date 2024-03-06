const {empReg,empLogin,validateToken} = require('../controllers/formController')
const {deleteData,getData, addData,updateDate, countData} = require("../controllers/dataController")
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

//add leads data
router.post("/create",addData)

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

module.exports = router