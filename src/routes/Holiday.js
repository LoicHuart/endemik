const express = require("express");
const router = new express.Router();
const HolidayController = require("../controllers/HolidayController");


router.route("/holidays")
  .post(HolidayController.addHoliday)
  .get(HolidayController.getHolidays)
  .delete(HolidayController.deleteHolidays);

router.route("/holidays/:id")
  .post(HolidayController.updateHoliday)
  .get(HolidayController.getHolidayByID);


module.exports = router;
