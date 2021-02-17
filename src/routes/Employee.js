const express = require("express");
const router = new express.Router();
const EmployeeController = require("../controllers/EmployeeController");


router.route("/employees")
  .post(EmployeeController.addEmployee)
  .get(EmployeeController.getAllEmployees);
    
router.route("/employees/:id")
  .put(EmployeeController.updateEmployee)
  .delete(EmployeeController.deleteEmployee)
  .get(EmployeeController.getEmployeeById);



module.exports = router;
