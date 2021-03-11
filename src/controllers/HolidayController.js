const HolidaySchema = require("../models/Holiday");
const EmployeeSchema = require("../models/Employee");
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
        throw "Invalid keys";
      }

      if (
        req.body.id_requester_employee &&
        !(await EmployeeSchema.exists({
          _id: req.body.id_requester_employee,
        }).catch((err) => {
          throw "Invalid employee id";
        }))
      ) {
        throw "Invalid employee id";
      }

      const holiday = new HolidaySchema(req.body);
      await holiday.save();
      res.status(201).send(holiday);
      NotificationController.NewHolidayRequestToManager(holiday.id);
    } catch (err) {
      res.status(400).send({
        message: "Error when adding a holiday",
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
        throw "Invalid holiday id";
      }

      res.send(holiday);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting a holiday by id",
        error: err,
      });
    }
  },

  async getHolidaysByUser(req, res) {
    const id = req.params.id;
    try {
      if (
        id &&
        !(await EmployeeSchema.exists({ _id: id }).catch((err) => {
          throw "Invalid employee id";
        }))
      ) {
        throw "Invalid employee id";
      }
      holidays = await HolidaySchema.find({ id_requester_employee: id });
      res.send(holidays);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting a holiday by id",
        error: err,
      });
    }
  },

  async getAllHolidays(req, res) {
    const populate = parseInt(req.query.populate);
    let holidays;
    try {
      if (populate) {
        holidays = await HolidaySchema.find().populate("id_requester_employee");
      } else {
        holidays = await HolidaySchema.find();
      }
      res.send(holidays);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting all holiday",
        error: err,
      });
    }
  },

  async deleteHoliday(req, res) {
    const id = req.params.id;
    try {
      holiday = await HolidaySchema.findById(id);
      if (!holiday) {
        throw "Invalid holiday id";
      }
      holiday.remove();

      res.send({
        message: `Holiday deleted`,
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when deleting a holiday",
        error: err,
      });
    }
  },

  async deleteAllHolidays(req, res) {
    try {
      await HolidaySchema.deleteMany();
      res.send({
        message: `All holidays have been delete`,
      });
    } catch (error) {
      res.status(400).send({
        message: "Error when deleting all holiday",
        error: err,
      });
    }
  },

  async updateHoliday(req, res) {
    const id = req.params.id;
    try {
      if (
        !checkKeys(req.body, [
          "validation_date",
          "note",
          "starting_date",
          "ending_date",
          "current_date",
          "type",
          "id_requester_employee",
        ])
      ) {
        throw "Invalid keys";
      }

      if (
        req.body.id_requester_employee &&
        !(await HolidaySchema.exists({
          _id: req.body.id_requester_employee,
        }).catch((err) => {
          throw "Invalid employee id";
        }))
      ) {
        throw "Invalid employee id";
      }

      holiday = await HolidaySchema.findById(id);
      if (!holiday) {
        throw "Invalid holiday id";
      }
      updateKeys = Object.keys(req.body);
      updateKeys.forEach((key) => (holiday[key] = req.body[key]));
      await holiday.save();

      res.send({
        message: `Holiday ${id} was updated !`,
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when updating a holiday",
        error: err,
      });
    }
  },

  async updateHolidayStatus(req, res) {
    const id = req.params.id;
    try {
      if (!checkKeys(req.body, ["status"])) {
        throw "Invalid keys";
      }

      statusHoliday = await HolidaySchema.findById(id).status;
      holiday = await HolidaySchema.findById(id);
      if (!holiday) {
        throw "Invalid holiday id";
      }
      updateKeys = Object.keys(req.body);
      updateKeys.forEach((key) => (holiday[key] = req.body[key]));
      await holiday.save();

      res.send({
        message: `Holiday status ${id} was updated !`,
      });
      if (statusHoliday != req.body.status) {
        NotificationController.HolidayRequestStatusUpdateToEmployee(id);
        NotificationController.HolidayRequestStatusUpdateToManager(id);
        if (req.body.status == "prevalider") {
          NotificationController.NewHolidayRequestToRh(id);
        }
      }
    } catch (err) {
      res.status(400).send({
        message: "Error when updating a holiday",
        error: err,
      });
    }
  },
};

function checkKeys(body, allowedKeys) {
  const updatesKeys = Object.keys(body);
  return updatesKeys.every((key) => allowedKeys.includes(key));
}

module.exports = HolidayController;
