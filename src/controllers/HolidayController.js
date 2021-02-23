const HolidaySchema = require("../models/Holiday");
const NotificationController = require("../controllers/NotificationController");


var HolidayController = {
  async addHoliday(req, res) {
    try {
      if (
        !checkKeys(req.body, [
          "note",
          "starting_date",
          "ending_date",
          "type",
          "id_requester_employee",
        ])
      ) {
        throw{
          error: "invalid keys",
        };
      }
      const holiday = new HolidaySchema(req.body);
      await holiday.save();
      res.status(201).send(holiday);
      NotificationController.NewHolidayRequestToManager(holiday.id);
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

  async getAllHolidays(req, res) {
    const populate = parseInt(req.query.populate);
    let holidays;
    try {
      if (populate) {
        holidays = await HolidaySchema.find()
          .populate("id_requester_employee");
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
        if(req.body.status) {
          NotificationController.HolidayRequestStatusUpdateToEmployee(id);
          NotificationController.HolidayRequestStatusUpdateToManager(id);
          if(req.body.status == "prevalider") {
            NotificationController.NewHolidayRequestToRh(id);
          }
        }
      })
      .catch((err) => res.status(500).send(err));
  },
};

function checkKeys(body, allowedKeys) {
  const updatesKeys = Object.keys(body);
  return updatesKeys.every((key) => allowedKeys.includes(key));
}

module.exports = HolidayController;
