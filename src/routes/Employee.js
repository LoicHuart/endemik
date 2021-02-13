const express = require("express");
const router = new express.Router();
const EmployeeController = require("../controllers/EmployeeController");


router.route("/employees")
  .post(EmployeeController.addEmployee)
  .get(EmployeeController.getEmployeeById);
    
router.route("/employees/:id")
  .post(EmployeeController.editEmployee)
  .delete(EmployeeController.deleteEmployee);

router.route("/employees/all")
  .get(EmployeeController.getEmployees);

module.exports = router;
