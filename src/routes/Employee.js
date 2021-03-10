const express = require("express");
const router = new express.Router();
const EmployeeController = require("../controllers/EmployeeController");
const NotificationController = require("../controllers/NotificationController");
const UploadPicture = require("../middlewares/UploadPicture");
const isLoggedIn = require("../middlewares/isLoggedIn");
const hasAccessRole = require("../middlewares/hasAccessRole");

router
  .route("/employees")
  .post(
    isLoggedIn,
    hasAccessRole(["admin", "direction", "DEV"]),
    UploadPicture.single("photo"),
    EmployeeController.addEmployee
  )
  .get(
    isLoggedIn,
    hasAccessRole(["admin", "direction", "rh", "DEV"]),
    EmployeeController.getAllEmployees
  );

router
  .route("/employees/:id")
  .put(
    isLoggedIn,
    hasAccessRole(["admin", "direction", "DEV"]),
    UploadPicture.single("photo"),
    EmployeeController.updateEmployee
  )
  .delete(
    isLoggedIn,
    hasAccessRole(["admin", "direction", "DEV"]),
    EmployeeController.deleteEmployee
  )
  .get(
    isLoggedIn,
    hasAccessRole(["admin", "direction", "rh", "employee", "DEV"]),
    EmployeeController.getEmployeeById
  );

router
  .route("/employees/forgotPassword/:mail")
  .get(NotificationController.ForgotPasswordToDirection);

router
  .route("/update")
  .put(
    isLoggedIn,
    hasAccessRole(["direction", "DEV", "admin"]),
    EmployeeController.updatePassword
  );

module.exports = router;
