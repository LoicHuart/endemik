const EmployeeSchema = require("../models/Employee");
const ServiceSchema = require("../models/Service");
const RoleSchema = require("../models/Role");
const HolidaySchema = require("../models/Holiday");
const NotificationController = require("../controllers/NotificationController");
const fs = require("fs");
const path = require("path");
const bcrypt = require("bcrypt");

var EmployeeController = {
  async addEmployee(req, res) {
    try {
      if (
        !checkKeys(req.body, [
          "title",
          "firstName",
          "lastName",
          "date_birth",
          "social_security_number",
          "mail",
          "tel_nb",
          "postal_code",
          "street_nb",
          "street",
          "city",
          "arrival_date",
          "children_nb",
          "holiday_balance.rtt",
          "holiday_balance.congesPayes",
          "id_service",
          "id_role",
          "active",
          "isManager"
        ])
      ) {
        throw { err: "Invalid keys", code: "1" };
      }

      service = await ServiceSchema.findById(req.body.id_service)
      if (!service && req.body.id_service) {
        throw { err: "Invalid service id", code: "2" };
      }

      role = await RoleSchema.findById(req.body.id_role)
      if (!role && req.body.id_role) {
        throw { err: "Invalid role id", code: "3" };
      }

      employeeMail = await EmployeeSchema.findOne({ mail: req.body.mail });
      if (employeeMail && req.body.mail) {
        throw { err: "Mail already used", code: "4" };
      }

      if (req.file) {
        req.body.photo_url = req.file.filename;
      }
      let Employee = new EmployeeSchema(req.body);
      let password = generatePassword();
      Employee.password = await cryptPassword(password);
      await Employee.save();
      res.status(201).send(Employee);
      NotificationController.NewEmployeetoServiceToManager(Employee.id);
      NotificationController.NewEmployeeRegistedToDirection(Employee.id);
      NotificationController.NewEmployeeRegistedToEmployee(
        Employee.id,
        password
      );
    } catch (err) {
      try {
        fs.unlinkSync(
          path.resolve(
            __dirname + "../../../public/uploads/" + req.file.filename
          )
        );
      } catch { }
      res.status(400).send({
        message: "Error : can't created employee",
        error: err.err,
        code: err.code
      });
    }
  },

  async updateEmployee(req, res) {
    console.log(req.body)
    const id = req.params.id;
    try {
      if (
        !checkKeys(req.body, [
          "photo_url",
          "title",
          "firstName",
          "lastName",
          "date_birth",
          "social_security_number",
          "mail",
          "tel_nb",
          "postal_code",
          "street_nb",
          "street",
          "city",
          "arrival_date",
          "children_nb",
          "holiday_balance.rtt",
          "holiday_balance.congesPayes",
          "id_service",
          "id_role",
          "active",
          "isManager"
        ])
      ) {
        throw { err: "Invalid keys", code: "5" };
      }

      if (!req.body.active) {
        req.body.active = false
      }

      employee = await EmployeeSchema.findById(id)
      if (!employee) {
        throw { err: "Invalid employee id", code: "6" };
      }

      role = await RoleSchema.findById(req.body.id_role)
      if (!role && req.body.id_role) {
        throw { err: "Invalid role id", code: "7" };
      }

      employeeMail = await EmployeeSchema.findOne({ mail: req.body.mail });
      if (employeeMail && (employee.mail != employeeMail.mail)) {
        throw { err: "Mail already used", code: "8" };
      }

      serviceEmployee = employee.id_service;

      service = await ServiceSchema.findById(req.body.id_service)
      if (!service && req.body.id_service) {
        throw { err: "Invalid service id", code: "9" };
      }

      serviceManager = await ServiceSchema.findOne({ id_manager: id });
      if (serviceManager && (serviceManager._id != req.body.id_service)) {
        throw { err: `Cannot update the service of this employee, this employee is the manager of the service ${serviceManager.name}`, code: "10" };
      }

      if (serviceManager && !req.body.active) {
        throw { err: `Cannot deactivate this employee, this employee is the manager of the service ${serviceManager.name}`, code: "11" };
      }

      holidayRequest = await HolidaySchema.findOne({ id_requester_employee: id, status: "en attente" })
      holidayRequest += await HolidaySchema.findOne({ id_requester_employee: id, status: "prévalidé" })
      if (holidayRequest && !req.body.active) {
        throw { err: `This employee has holiday request`, code: "12" };
      }

      if (req.file) {
        try {
          fs.unlinkSync(
            path.resolve(
              __dirname + "../../../public/uploads/" + employee.photo_url
            )
          );
        } catch { }
        req.body.photo_url = req.file.filename;
      }

      updateKeys = Object.keys(req.body);
      updateKeys.forEach((key) => (employee[key] = req.body[key]));
      if (req.body['holiday_balance.rtt']) {
        employee.holiday_balance.rtt = req.body["holiday_balance.rtt"]
      }
      if (req.body['holiday_balance.congesPayes']) {
        employee.holiday_balance.congesPayes = req.body["holiday_balance.congesPayes"]
      }
      await employee.save();

      res.send({
        message: `Employee (${id}) have been updated`,
      });
      if (serviceEmployee != req.body.id_service) {
        NotificationController.NewEmployeetoServiceToManager(id);
      }
    } catch (err) {
      try {
        fs.unlinkSync(
          path.resolve(
            __dirname + "../../../public/uploads/" + req.file.filename
          )
        );
      } catch { }
      console.log(err)
      res.status(400).send({
        message: `Error : can't updated employee with id(${id})`,
        error: err.err,
        code: err.code
      });
    }
  },

  async getAllEmployees(req, res) {
    const populate = parseInt(req.query.populate);
    let filtres = 'title lastName firstName date_birth social_security_number mail tel_nb postal_code street_nb street city arrival_date children_nb photo_url active holiday_balance id_service id_role isManager';
    let employees;
    try {
      if (populate) {
        employees = await EmployeeSchema.find(req.body, filtres)
          .populate("id_service")
          .populate("id_role");
      } else {
        employees = await EmployeeSchema.find(req.body, filtres);
      }

      if (!employees) {
        throw { err: `employee not found`, code: "13" };
      }
      res.send(employees);
    } catch (err) {
      res.status(400).send({
        message: "Error : can't get all employee",
        error: err.err,
        code: err.code
      });
    }
  },

  async getEmployeeById(req, res) {
    const id = req.params.id;
    const populate = parseInt(req.query.populate);
    let filtres = 'title lastName firstName date_birth social_security_number mail tel_nb postal_code street_nb street city arrival_date children_nb photo_url active holiday_balance id_service id_role isManager';
    let employee;
    try {
      if (populate) {
        employee = await EmployeeSchema.findById(id, filtres)
          .populate("id_service")
          .populate("id_role");
      } else {
        employee = await EmployeeSchema.findById(id, filtres);
      }

      if (!employee) {
        throw { err: "Invalid employee id", code: "14" };
      }

      res.send(employee);
    } catch (err) {
      res.status(400).send({
        message: `Error : can't get employee with id (${id}) `,
        error: err.err,
        code: err.code
      });
    }
  },

  async deleteEmployee(req, res) {
    const id = req.params.id;
    try {
      employee = await EmployeeSchema.findById(id);
      if (!employee) {
        throw { err: "Invalid employee id", code: "15" };
      }
      holiday = await HolidaySchema.findOne({ id_requester_employee: id });
      if (holiday) {
        throw { err: "this employee has holidays requests pending", code: "16" };
      }

      service = await ServiceSchema.findOne({ id_manager: id });
      if (service) {
        throw { err: `this employee is the manager of the service ${service.name}`, code: "17" };
      }

      try {
        fs.unlinkSync(
          path.resolve(
            __dirname + "../../../public/uploads/" + employee.photo_url
          )
        );
      } catch { }
      employee.remove();

      res.send({
        message: `Employee deleted`,
      });
    } catch (err) {
      res.status(400).send({
        message: `Error : can't delete employee with id (${id})`,
        error: err.err,
        code: err.code
      });
    }
  },

  async updatePassword(req, res) {
    let mail = req.params.mail;
    let password = generatePassword();
    let Employee = await EmployeeSchema.findOne({ mail: mail });

    if (!Employee) {
      res.status(400).send({
        message: "Error when send ForgotPassword",
        error: "Invalid employee mail",
        code: "18"
      });
      res.end();
    } else {
      Employee.password = await cryptPassword(password);
      await Employee.save();

      res.send({
        message: "Password has been update",
      });
      NotificationController.ForgotPasswordToEmployee(Employee.id, password);
    }
  },

  async getAllRoles(req, res) {
    try {
      roles = await RoleSchema.find();
      res.send(roles);
    } catch (err) {
      res.status(400).send({
        message: "Error : can't get all roles",
        error: err
      });
    }
  },
};

function checkKeys(body, allowedKeys) {
  const updatedKeys = Object.keys(body);
  return updatedKeys.every((key) => allowedKeys.includes(key));
}

function generatePassword() {
  var length = 8,
    charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
    retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
    retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

async function cryptPassword(password) {
  // console.log("password : " + password);
  password = await bcrypt.hash(password, 10);
  // console.log("password crypt : " + password);
  return password;
}

module.exports = EmployeeController;
