var HolidaySchema = require("../models/Holiday");

var HolidayController = {
  async addHoliday(req, res) {
    try {
      const holiday = new HolidaySchema(req.body);
      await holiday.save();
      res.status(201).send(holiday);
    } catch (err) {
      console.log(err);
      res.status(400).send({
        error: err,
      });
    }
  },

  async getHolidayByID(req, res) {
    const id = req.params.id;
    const populate = parseInt(req.query.populate);
    let holiday;
    try {
      if (populate) {
        holiday = await HolidaySchema.findById(id).populate(
          "id_requester_employee"
        );
      } else {
        holiday = await HolidaySchema.findById(id);
      }

      if (!holiday) {
        return res.status(404).send({
          message: "holiday not found",
        });
      }
      res.send(holiday);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async getHolidays(req, res) {
    const populate = parseInt(req.query.populate);
    let holidays;
    try {
      if (populate) {
        holidays = await HolidaySchema.find().populate("id_requester_employee");
      } else {
        holidays = await HolidaySchema.find();
      }

      if (!holidays) {
        return res.status(404).send({
          message: "holiday not found",
        });
      }
      res.send(holidays);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async deleteHoliday(req, res) {
    const id = req.params.id;
    try {
      await HolidaySchema.findByIdAndDelete(id);
      res.send({
        message: `Holiday deleted`,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async deleteAllHolidays(req, res) {
    try {
      await HolidaySchema.deleteMany();
      res.send({
        message: `All holidays have been delete`,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async updateHoliday(req, res) {
    const id = req.params.id;
    if (
      !checkKeys(req.body, [
        "validation_date",
        "note",
        "starting_date",
        "ending_date",
        "current_date",
        "status",
        "type",
        "id_requester_employee",
      ])
    ) {
      return res.status(400).send({
        error: "invalid keys",
      });
    }
    HolidaySchema.findByIdAndUpdate(id, req.body)
      .then(() => {
        res.send({
          message: `Holiday ${id} was updated !`,
        });
      })
      .catch((err) => res.status(500).send(err));
  },
};

function checkKeys(body, allowedKeys) {
  const updatesKeys = Object.keys(body);
  return updatesKeys.every((key) => allowedKeys.includes(key));
}

module.exports = HolidayController;
