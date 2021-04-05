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
        ])
      ) {
        throw "Invalid keys";
      }

      if (
        req.body.id_service &&
        !(await ServiceSchema.exists({ _id: req.body.id_service }).catch(
          (err) => {
            throw "Invalid service id";
          }
        ))
      ) {
        throw "Invalid service id";
      }
      if (
        req.body.id_role &&
        !(await RoleSchema.exists({ _id: req.body.id_role }).catch((err) => {
          throw "Invalid role id";
        }))
      ) {
        throw "Invalid role id";
      }
      if (
        req.body.mail &&
        (await EmployeeSchema.exists({ mail: req.body.mail }).catch((err) => {
          throw "Mail already used";
        }))
      ) {
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
      } catch {}
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
        ])
      ) {
        throw "Invalid keys";
      }

      if (
        id &&
        !(await EmployeeSchema.exists({ _id: id }).catch((err) => {
          throw "Invalid employee id";
        }))
      ) {
        throw "Invalid employee id";
      }
      if (
        req.body.id_service &&
        !(await ServiceSchema.exists({ _id: req.body.id_service }).catch(
          (err) => {
            throw "Invalid service id";
          }
        ))
      ) {
        throw "Invalid service id";
      }
      if (
        req.body.id_role &&
        !(await RoleSchema.exists({ _id: req.body.id_role }).catch((err) => {
          throw "Invalid role id";
        }))
      ) {
        throw "Invalid role id";
      }
      if (
        req.body.mail &&
        !(await EmployeeSchema.exists({ mail: req.body.mail }).catch((err) => {
          throw "Mail already used";
        }))
      ) {
        throw "Mail already used";
      }

      serviceEmployee = await EmployeeSchema.findById(id).id_service;
      employee = await EmployeeSchema.findById(id);
      if (!employee) {
        throw "Invalid employee id";
      }

      if (req.file) {
        try {
          fs.unlinkSync(
            path.resolve(
              __dirname + "../../../public/uploads/" + employee.photo_url
            )
          );
        } catch {}
        req.body.photo_url = req.file.filename;
      }

      updateKeys = Object.keys(req.body);
      updateKeys.forEach((key) => (employee[key] = req.body[key]));
      employee.holiday_balance.rtt = JSON.parse(
        req.body["holiday_balance.rtt"]
      );
      employee.holiday_balance.congesPayes = JSON.parse(
        req.body["holiday_balance.congesPayes"]
      );

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
      } catch {}
      res.status(400).send({
        message: `Error : can't updated employee with id(${id})`,
        error: err,
      });
    }
  },

  async getAllEmployees(req, res) {
    const populate = parseInt(req.query.populate);
    let employees;
    try {
      if (populate) {
        employees = await EmployeeSchema.find(req.body)
          .populate("id_service")
          .populate("id_role");
      } else {
        employees = await EmployeeSchema.find(req.body);
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
    let employee;
    try {
      if (populate) {
        employee = await EmployeeSchema.findById(id)
          .populate("id_service")
          .populate("id_role");
      } else {
        employee = await EmployeeSchema.findById(id);
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
      holiday = await HolidaySchema.find({ id_requester_employee: id });
      if (holiday[0]) {
        throw "this employee has holidays requests pending";
      }

      try {
        fs.unlinkSync(
          path.resolve(
            __dirname + "../../../public/uploads/" + employee.photo_url
          )
        );
      } catch {}
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
