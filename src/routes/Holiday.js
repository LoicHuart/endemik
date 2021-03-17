const express = require("express");
const router = new express.Router();
const HolidayController = require("../controllers/HolidayController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const hasAccessRole = require("../middlewares/hasAccessRole");



router
  .route("/holidays/:id")
  .put(isLoggedIn, hasAccessRole(['admin','direction','rh','employee','DEV']), HolidayController.updateHoliday)
  .get(isLoggedIn, hasAccessRole(['admin','direction','rh','employee','DEV']), HolidayController.getHolidayByID)
  .delete(isLoggedIn, hasAccessRole(['admin','direction','rh','employee','DEV']), HolidayController.deleteHoliday);

router
  .route("/holidays")
  .post(isLoggedIn, hasAccessRole(['admin','direction','rh','employee','DEV']), HolidayController.addHoliday)
  .get(isLoggedIn, hasAccessRole(['direction','rh','employee','DEV']), HolidayController.getAllHolidays)
  .delete(isLoggedIn, hasAccessRole(['DEV']), HolidayController.deleteAllHolidays);
  
router
  .route("/holidays/user/:id")
  .get(isLoggedIn, hasAccessRole(['admin','direction','rh','employee','DEV']), HolidayController.getHolidaysByUser);

router
  .route("/holidays/status/:status/:id")
  .get(HolidayController.updateHolidayStatus)
  
module.exports = router;
