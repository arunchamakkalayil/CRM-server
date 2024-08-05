const {empReg,empLogin,validateToken,verifyEmail,resetPassword,newPassword,validateTokenReset} = require('../controllers/formController')
const {deleteData,getData,updateCamp, deleteCamp, addData,updateDate,addExcel, countData,monthCount, getCamp, addCamp} = require("../controllers/dataController")
const {addContactData,getContactData,updateContact,deleteContact, getContacts} = require('../controllers/ContactController')
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

// add Contacts
router.post("/contactform",addContactData)

// get Contacts
router.get("/contact",getContactData)

// upt Contact
router.put('/contact/:id', updateContact)

// Delete Contactd item route
router.delete('/contact/:id', deleteContact);

//send email
router.post('/email',autoEmail)

//monthcount
router.get('/monthCount',monthCount)

router.get('/camps',getCamp)
router.post('/addcamp',addCamp)
router.delete('/camps/:id', deleteCamp);

router.get('/contact-numbers',getContacts)
// Define the verification endpoint
router.get('/verify-email/:token', verifyEmail);

//email link to reset password
router.post('/resetpassword',resetPassword)

///new password
router.post('/reset-password/:token',newPassword)

//token for reset

router.get("/validate-token/:token",validateTokenReset)

module.exports = router