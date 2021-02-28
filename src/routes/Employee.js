const express = require("express");
const router = new express.Router();
const EmployeeController = require("../controllers/EmployeeController");
const UploadPicture = require("../middlewares/UploadPicture");

router.route("/employees")
  .post(UploadPicture.single('photo') ,EmployeeController.addEmployee)
  .get(EmployeeController.getAllEmployees);
    
router.route("/employees/:id")
  .put(UploadPicture.single('photo'), EmployeeController.updateEmployee)
  .delete(EmployeeController.deleteEmployee)
  .get(EmployeeController.getEmployeeById);



module.exports = router;
