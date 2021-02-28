const express = require("express");
const router = new express.Router();
const EmployeeController = require("../controllers/EmployeeController");
const UploadPicture = require("../middlewares/UploadPicture");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.route("/employees")
  .post(isLoggedIn, UploadPicture.single('photo'), EmployeeController.addEmployee)
  .get(isLoggedIn, EmployeeController.getAllEmployees);
    
router.route("/employees/:id")
  .put(isLoggedIn, UploadPicture.single('photo'), EmployeeController.updateEmployee)
  .delete(isLoggedIn, EmployeeController.deleteEmployee)
  .get(isLoggedIn, EmployeeController.getEmployeeById);

module.exports = router;
