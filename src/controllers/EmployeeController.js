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
        throw "Invalid keys";
      }

      service = await ServiceSchema.findById(req.body.id_service)
      if (!service && req.body.id_service) {
        throw "Invalid service id";
      }

      role = await RoleSchema.findById(req.body.id_role)
      if (!role && req.body.id_role) {
        throw "Invalid role id";
      }

      employeeMail = await EmployeeSchema.findOne({ mail: req.body.mail });
      if (employeeMail && req.body.mail) {
        throw "Mail already used";
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
        error: err,
      });
    }
  },

  async updateEmployee(req, res) {
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
        throw "Invalid keys";
      }

      employee = await EmployeeSchema.findById(id)
      if (!employee) {
        throw "Invalid employee id";
      }

      role = await RoleSchema.findById(req.body.id_role)
      if (!role && req.body.id_role) {
        throw "Invalid role id";
      }

      employeeMail = await EmployeeSchema.findOne({ mail: req.body.mail });
      if (employeeMail && (employee.mail != employeeMail.mail)) {
        throw "Mail already used";
      }

      serviceEmployee = employee.id_service;

      service = await ServiceSchema.findById(req.body.id_service)
      if (!service && req.body.id_service) {
        throw "Invalid service id";
      }

      serviceManager = await ServiceSchema.findOne({ id_manager: id });
      if (serviceManager && (serviceManager._id != req.body.id_service)) {
        throw `Cannot update the service of this employee, this employee is the manager of the service ${serviceManager.name}`;
      }

      req.body.active = JSON.parse(req.body.active);
      if (serviceManager && (req.body.active === false || req.body.active === 0)) {
        throw `Cannot deactivate this employee, this employee is the manager of the service ${serviceManager.name}`;
      }

      holidayRequest = await HolidaySchema.findOne({ id_requester_employee: id, status: "en attente" })
      holidayRequest += await HolidaySchema.findOne({ id_requester_employee: id, status: "prévalidé" })
      if (holidayRequest && (req.body.active === false || req.body.active === 0)) {
        throw `This employee has holiday request`;
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
    } catch (error) {
      console.log(error);
      try {
        fs.unlinkSync(
          path.resolve(
            __dirname + "../../../public/uploads/" + req.file.filename
          )
        );
      } catch { }
      res.status(400).send({
        message: `Error : can't updated employee with id(${id})`,
        error: error,
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
        return res.status(404).send({
          message: "employee not found",
        });
      }
      res.send(employees);
    } catch (err) {
      res.status(400).send({
        message: "Error : can't get all employee",
        error: err,
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
        throw "Invalid employee id";
      }

      res.send(employee);
    } catch (err) {
      res.status(400).send({
        message: `Error : can't get employee with id (${id}) `,
        error: err,
      });
    }
  },

  async deleteEmployee(req, res) {
    const id = req.params.id;
    try {
      employee = await EmployeeSchema.findById(id);
      if (!employee) {
        throw "Invalid employee id";
      }
      holiday = await HolidaySchema.findOne({ id_requester_employee: id });
      if (holiday) {
        throw "this employee has holidays requests pending";
      }

      service = await ServiceSchema.findOne({ id_manager: id });
      if (service) {
        throw `this employee is the manager of the service ${service.name}`;
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
        error: err,
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
