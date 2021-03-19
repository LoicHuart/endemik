const express = require("express");
const router = new express.Router();
const ServiceController = require("../controllers/ServiceController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const hasAccessRole = require("../middlewares/hasAccessRole");

router
  .route("/services")
  .post(
    isLoggedIn,
    hasAccessRole(["direction", "admin", "DEV"]),
    ServiceController.addService
  )
  .get(
    isLoggedIn,
    hasAccessRole(["direction", "DEV"]),
    ServiceController.getAllServices
  )
  .delete(
    isLoggedIn,
    hasAccessRole(["direction", "admin", "DEV"]),
    ServiceController.deleteAllServices
  );

router
  .route("/services/:id")
  .put(
    isLoggedIn,
    hasAccessRole(["direction", "admin", "DEV"]),
    ServiceController.updateService
  )
  .get(
    isLoggedIn,
    hasAccessRole(["direction", "admin", "direction", "rh", "employee", "DEV"]),
    ServiceController.getServiceByID
  )
  .delete(
    isLoggedIn,
    hasAccessRole(["direction", "admin", "DEV"]),
    ServiceController.deleteService
  );

module.exports = router;
