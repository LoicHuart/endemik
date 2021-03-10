const express = require("express");
const router = new express.Router();
const ServiceController = require("../controllers/ServiceController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const hasAccessRole = require("../middlewares/hasAccessRole");

router
  .route("/services")
  .post(isLoggedIn, hasAccessRole(['admin','DEV']), ServiceController.addService)
  .get(isLoggedIn, hasAccessRole(['DEV']), ServiceController.getAllServices)
  .delete(isLoggedIn, hasAccessRole(['admin','DEV']), ServiceController.deleteAllServices);

router
  .route("/services/:id")
  .put(isLoggedIn, hasAccessRole(['admin','DEV']), ServiceController.updateService)
  .get(isLoggedIn, hasAccessRole(['admin','direction','rh','employee','DEV']), ServiceController.getServiceByID)
  .delete(isLoggedIn, hasAccessRole(['admin','DEV']), ServiceController.deleteService);

module.exports = router;
