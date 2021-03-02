const EmployeeSchema = require("../models/Employee");
const ServiceSchema = require("../models/Service");
const RoleSchema = require("../models/Role");
const NotificationController = require("../controllers/NotificationController");

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

      const Employee = new EmployeeSchema(req.body);
      await Employee.save();
      res.status(201).send(Employee);
      NotificationController.NewEmployeetoServiceToManager(Employee.id);
      NotificationController.NewEmployeeRegistedToDirection(Employee.id);
    } catch (err) {
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

      serviceEmployee = await EmployeeSchema.findById(id).id_service;
      EmployeeSchema.findByIdAndUpdate(id, req.body);
      res.send({
        message: `Employee (${id}) have been updated`,
      });
      if (serviceEmployee != req.body.id_service) {
        NotificationController.NewEmployeetoServiceToManager(id);
      }
    } catch (err) {
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
        employees = await EmployeeSchema.find()
          .populate("id_service")
          .populate("id_role");
      } else {
        employees = await EmployeeSchema.find();
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
      if (
        id &&
        !(await EmployeeSchema.exists({ _id: id }).catch((err) => {
          throw "Invalid employee id";
        }))
      ) {
        throw "Invalid employee id";
      }
      if (populate) {
        employee = await EmployeeSchema.findById(id)
          .populate("id_service")
          .populate("id_role");
      } else {
        employee = await EmployeeSchema.findById(id);
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
      if (
        id &&
        !(await EmployeeSchema.exists({ _id: id }).catch((err) => {
          throw "Invalid employee id";
        }))
      ) {
        throw "Invalid employee id";
      }

      await EmployeeSchema.findByIdAndDelete(id);
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
};

function checkKeys(body, allowedKeys) {
  const updatedKeys = Object.keys(body);
  return updatedKeys.every((key) => allowedKeys.includes(key));
}
module.exports = EmployeeController;
