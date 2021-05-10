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
        throw { err: "Invalid keys", code: "19" };
      }

      let employee = await EmployeeSchema.findById(
        req.body.id_requester_employee
      );
      if (!employee) {
        throw { err: "Invalid employee id", code: "20" };
      }
      diff = dayDiff(req.body.starting_date, req.body.ending_date);
      if (diff >= 0) {
        if (req.body.type == "rtt") {
          if (employee.holiday_balance.rtt - diff < 0) {
            throw { err: "The employee does not have enough holidays", code: "21" };
          } else {
            employee.holiday_balance.rtt = employee.holiday_balance.rtt - diff;
          }
        }
        if (req.body.type == "congés payés") {
          if (employee.holiday_balance.congesPayes - diff < 0) {
            throw { err: "The employee does not have enough holidays", code: "22" };
          } else {
            employee.holiday_balance.congesPayes =
              employee.holiday_balance.congesPayes - diff;
          }
        }
        employee.save();
      } else {
        throw { err: "invalid date", code: "23" };
      }

      const holiday = new HolidaySchema(req.body);
      await holiday.save();
      res.status(201).send(holiday);
      NotificationController.NewHolidayRequestToManager(holiday.id);
    } catch (err) {
      console.log(err);
      res.status(400).send({
        message: "Error when adding a holiday",
        error: err.err,
        code: err.code
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
        throw { err: "Invalid holiday id", code: "24" };
      }

      res.send(holiday);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting a holiday by id",
        error: err.err,
        code: err.code
      });
    }
  },

  async getHolidaysByUser(req, res) {
    const id = req.params.id;
    try {
      employee = await EmployeeSchema.findById(id)
      if (!employee) {
        throw { err: "Invalid employee id", code: "25" };
      }
      holidays = await HolidaySchema.find({ id_requester_employee: id });
      res.send(holidays);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting a holiday by id",
        error: err.err,
        code: err.code
      });
    }
  },

  async getAllHolidays(req, res) {
    const populate = parseInt(req.query.populate);
    let holidays;
    try {
      if (populate) {
        holidays = await HolidaySchema.find(req.body).populate(
          "id_requester_employee"
        );
      } else {
        holidays = await HolidaySchema.find(req.body);
      }

      if (!holidays) {
        throw { err: `holidays not found`, code: "26" };
      }
      res.send(holidays);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting all holiday",
        error: err.err,
        code: err.code
      });
    }
  },

  async getHolidaysByService(req, res) {
    const idService = req.params.idService;
    console.log(idService);
    const populate = parseInt(req.query.populate);
    let holidays;
    try {
      if (populate) {
        holidays = await HolidaySchema.find(req.body).populate(
          "id_requester_employee"
        );
      } else {
        holidays = await HolidaySchema.find(req.body);
      }

      let holidaysService = [];
      holidays.forEach((holiday) => {
        if (holiday.id_requester_employee.id_service == idService) {
          holidaysService.push(holiday);
        }
      });

      if (!holidays) {
        throw { err: `holidays not found`, code: "27" };
      }

      res.send(holidaysService);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting holiday by service",
        error: err.err,
        code: err.code
      });
    }
  },

  async deleteHoliday(req, res) {
    const id = req.params.id;
    try {
      holiday = await HolidaySchema.findById(id);
      if (!holiday) {
        throw { err: "Invalid holiday id", code: "28" };
      }

      diff = dayDiff(holiday.starting_date, holiday.ending_date);
      let employee = await EmployeeSchema.findById(
        holiday.id_requester_employee
      );
      if (holiday.type == "rtt") {
        employee.holiday_balance.rtt =
          parseInt(employee.holiday_balance.rtt) + parseInt(diff);
      }
      if (holiday.type == "congés payés") {
        employee.holiday_balance.congesPayes =
          parseInt(employee.holiday_balance.congesPayes) + parseInt(diff);
      }
      holiday.remove();
      employee.save();
      res.send({
        message: `Holiday deleted`,
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when deleting a holiday",
        error: err.err,
        code: err.code
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
        ])
      ) {
        throw { err: "Invalid keys", code: "29" };
      }

      employeeExist = await EmployeeSchema.findById(req.body.id_requester_employee)
      if (!employeeExist && req.body.id_requester_employee) {
        throw { err: "Invalid employee id", code: "30" };
      }

      holiday = await HolidaySchema.findById(id);
      if (!holiday) {
        throw { err: "Invalid holiday id", code: "31" };
      }

      //rend les jours de congés
      diff = dayDiff(holiday.starting_date, holiday.ending_date);
      let employee = await EmployeeSchema.findById(holiday.id_requester_employee);
      if (holiday.type == "rtt") {
        employee.holiday_balance.rtt = parseInt(employee.holiday_balance.rtt) + parseInt(diff);
      }
      if (holiday.type == "congés payés") {
        employee.holiday_balance.congesPayes = parseInt(employee.holiday_balance.congesPayes) + parseInt(diff);
      }

      //retire les jours de congés par rapport a la request
      newdiff = dayDiff(req.body.starting_date, req.body.ending_date);
      if (req.body.type == "rtt") {
        employee.holiday_balance.rtt =
          parseInt(employee.holiday_balance.rtt) - parseInt(newdiff);
      }
      if (req.body.type == "congés payés") {
        employee.holiday_balance.congesPayes =
          parseInt(employee.holiday_balance.congesPayes) - parseInt(newdiff);
      }

      employee.save();

      updateKeys = Object.keys(req.body);
      updateKeys.forEach((key) => (holiday[key] = req.body[key]));
      await holiday.save();

      res.send({
        message: `Holiday ${id} was updated !`,
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when updating a holiday",
        error: err.err,
        code: err.code
      });
    }
  },

  async updateHolidayStatus(req, res) {
    const id = req.params.id;
    const status = req.params.status;
    try {
      if (!checkKeys({ status }, ["status"])) {
        throw { err: "Invalid keys", code: "32" };
      }

      holiday = await HolidaySchema.findById(id);
      if (!holiday) {
        throw { err: "Invalid holiday id", code: "33" };
      }
      statusHolidayCache = holiday.status;
      holiday.status = status;
      await holiday.save();
      res.send({
        message: `Holiday status ${id} was updated !`,
      });
      if (statusHolidayCache != status) {
        NotificationController.HolidayRequestStatusUpdateToEmployee(id);
        NotificationController.HolidayRequestStatusUpdateToManager(id);
        if (status == "prévalidée") {
          NotificationController.NewHolidayRequestToRh(id);
        }
      }
    } catch (err) {
      res.status(400).send({
        message: "Error when updating a holiday",
        error: err.err,
        code: err.code,
      });
    }
  },
};

function checkKeys(body, allowedKeys) {
  const updatesKeys = Object.keys(body);
  return updatesKeys.every((key) => allowedKeys.includes(key));
}

function dayDiff(d1, d2) {
  d1 = new Date(d1);
  d2 = new Date(d2);
  d1 = d1.getTime() / 86400000;
  d2 = d2.getTime() / 86400000;
  return new Number(d2 - d1).toFixed(0);
}

module.exports = HolidayController;
