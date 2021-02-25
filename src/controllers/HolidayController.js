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

      if(req.body.id_requester_employee && !await EmployeeSchema.exists({_id: req.body.id_requester_employee}).catch((err) => {throw "Invalid employee id"})) {
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
      if(id && !await HolidaySchema.exists({_id: id}).catch((err) => {throw "Invalid holiday id"})) {
        throw "Invalid holiday id";
      }
      if (populate) {
        holiday = await HolidaySchema.findById(id).populate(
          "id_requester_employee"
        );
      } else {
        holiday = await HolidaySchema.findById(id);
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
      if(id && !await EmployeeSchema.exists({_id: id}).catch((err) => {throw "Invalid employee id"})) {
        throw "Invalid employee id";
      }
      holidays = await HolidaySchema.find({id_requester_employee: id});
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

      if (!holidays) {
        return res.status(404).send({
          message: "Holiday not found",
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
      if(id && !await HolidaySchema.exists({_id: id}).catch((err) => {throw "Invalid holiday id"})) {
        throw "Invalid holiday id";
      }
      
      await HolidaySchema.findByIdAndDelete(id);
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
      res.status(500).send(error);
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
          "status",
          "type",
          "id_requester_employee",
        ])
      ) {
        throw "Invalid keys";
      }

      if(id && !await HolidaySchema.exists({_id: id}).catch((err) => {throw "Invalid holiday id"})) {
        throw "Invalid holiday id";
      }
      if(req.body.id_requester_employee && !await HolidaySchema.exists({_id: req.body.id_requester_employee}).catch((err) => {throw "Invalid employee id"})) {
        throw "Invalid employee id";
      }

      statusHoliday = await HolidaySchema.findById(id).status;
      HolidaySchema.findByIdAndUpdate(id, req.body)
      res.send({
        message: `Holiday ${id} was updated !`,
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
