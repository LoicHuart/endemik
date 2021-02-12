const Holiday = require("../../controllers/HolidayController");

function holidayRoutes(app) {
  app
    .post("/holidays", Holiday.addHoliday)
    .get("/holidays", Holiday.getHolidays)
    .delete("/holidays", Holiday.deleteHolidays)
    .post("/holidays/:id", Holiday.updateHoliday);
}

module.exports = holidayRoutes;
