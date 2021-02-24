const express = require("express");
const router = new express.Router();
const HolidayController = require("../controllers/HolidayController");

router
  .route("/holidays")
  .post(HolidayController.addHoliday)
  .get(HolidayController.getAllHolidays)
  .delete(HolidayController.deleteAllHolidays);

router
  .route("/holidays/:id")
  .put(HolidayController.updateHoliday)
  .get(HolidayController.getHolidayByID)
  .delete(HolidayController.deleteHoliday);

router.route("/holidays/user/:id").get(HolidayController.getHolidaysByUser);

module.exports = router;
