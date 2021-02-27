const express = require("express");
const router = new express.Router();
const ServiceController = require("../controllers/ServiceController");

router
  .route("/services")
  .post(ServiceController.addService)
  .get(ServiceController.getAllServices)
  .delete(ServiceController.deleteAllServices);

router
  .route("/services/:id")
  .put(ServiceController.updateService)
  .get(ServiceController.getServiceByID);
//   .delete(ServiceController.deleteService);

module.exports = router;
