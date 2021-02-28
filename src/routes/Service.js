const express = require("express");
const router = new express.Router();
const ServiceController = require("../controllers/ServiceController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router
  .route("/services")
  .post(isLoggedIn, ServiceController.addService)
  .get(isLoggedIn, ServiceController.getAllServices)
  .delete(isLoggedIn, ServiceController.deleteAllServices);

router
  .route("/services/:id")
  .put(isLoggedIn, ServiceController.updateService)
  .get(isLoggedIn, ServiceController.getServiceByID)
  .delete(isLoggedIn, ServiceController.deleteService);

module.exports = router;
