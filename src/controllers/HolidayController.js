var HolidaySchema = require("../models/Holiday");

var HolidayController = {
  async holidayManagement(req, res) {
    res.render("pages/HolidayManagement/HolidayManagement", {
      session: req.session,
    });
  },

  async holidayRequest(req, res) {
    res.render("pages/HolidayRequest/HolidayRequest", {
      session: req.session,
    });
  },

  async addHoliday(req, res) {
    const holiday = new HolidaySchema(req.body);
    console.log(holiday);
    try {
      await holiday.save();
      res.status(201).send(holiday);
    } catch (err) {
      res.status(400).send({
        error: err,
      });
    }
  },

  async getHolidays(req, res) {
    try {
      let holidays = await HolidaySchema.find();
      res.send(holidays);
    } catch (err) {
      res.status(500).send(err);
    }
  },
};

module.exports = HolidayController;
