const express = require("express");
const router = new express.Router();
const HolidayController = require("../controllers/HolidayController");


router.route("/holidays")
  .post(HolidayController.addHoliday)
  .get(HolidayController.getHolidays);
  
router.route("/holidays/:id")
  .put(HolidayController.updateHoliday)
  .get(HolidayController.getHolidayByID)
  .delete(HolidayController.deleteHoliday);


module.exports = router;
