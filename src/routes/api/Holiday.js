const Holiday = require("../../controllers/HolidayController");

function holydayRoutes(app) {
  app
    .post("/holidays", Holiday.addHoliday)
    .get("/holidays", Holiday.getHolidays);
}

module.exports = holydayRoutes;
