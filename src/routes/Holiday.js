const express = require("express");
const router = new express.Router();
const HolidayController = require("../controllers/HolidayController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router
  .route("/holidays")
  .post(isLoggedIn, HolidayController.addHoliday)
  .get(isLoggedIn, HolidayController.getAllHolidays)
  .delete(isLoggedIn, HolidayController.deleteAllHolidays);

router
  .route("/holidays/:id")
  .put(isLoggedIn, HolidayController.updateHoliday)
  .get(isLoggedIn, HolidayController.getHolidayByID)
  .delete(isLoggedIn, HolidayController.deleteHoliday);

router.route("/holidays/user/:id").get(HolidayController.getHolidaysByUser);

module.exports = router;
