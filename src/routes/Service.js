const express = require("express");
const router = new express.Router();
const HolidayController = require("../controllers/ServiceController");

router.route("/services").post(HolidayController.addService);
//   .get(HolidayController.getAllHolidays)
//   .delete(HolidayController.deleteAllHolidays);

// router
//   .route("/holidays/:id")
//   .put(HolidayController.updateHoliday)
//   .get(HolidayController.getHolidayByID)
//   .delete(HolidayController.deleteHoliday);

// router.route("/holidays/user/:id").get(HolidayController.getHolidaysByUser);

module.exports = router;
