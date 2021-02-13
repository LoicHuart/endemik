const Holiday = require("../../controllers/HolidayController");

function holidayRoutes(app) {
  app
    .post("/api/holidays", Holiday.addHoliday)
    .get("/api/holidays", Holiday.getHolidays)
    .delete("/api/holidays", Holiday.deleteHolidays)
    .post("/api/holidays/:id", Holiday.updateHoliday)
    .get("/api/holidays/:id", Holiday.getHolidayByID);
}

module.exports = holidayRoutes;
