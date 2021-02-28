const EmployeeSchema = require("../models/Employee");
const ServiceSchema = require("../models/Service");
const RoleSchema = require("../models/Role");
const NotificationController = require("../controllers/NotificationController");
const fs = require('fs');
const path = require('path');

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

      if(req.body.id_service && !await ServiceSchema.exists({_id: req.body.id_service}).catch((err) => {throw "Invalid service id"})) {
        throw "Invalid service id";
      }
      if(req.body.id_role && !await RoleSchema.exists({_id: req.body.id_role}).catch((err) => {throw "Invalid role id"})) {
        throw "Invalid role id";
      }
      
      if(req.file) {
        req.body.photo_url = req.file.filename;
      }
      const Employee = new EmployeeSchema(req.body);
      await Employee.save();
      res.status(201).send(Employee);
      NotificationController.NewEmployeetoServiceToManager(Employee.id);
      NotificationController.NewEmployeeRegistedToDirection(Employee.id);
    } catch (err) {
      try {
        fs.unlinkSync(path.resolve(__dirname + "../../../public/uploads/"+req.file.filename));
      } catch {}
      res.status(400).send({
        message: "Error when creating a employee",
        error: err
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
          "password",
          "arrival_date",
          "children_nb",
          "id_service",
          "id_role",
        ])
      ) {
        throw "Invalid keys";
      }

      if(req.body.id_service && !await ServiceSchema.exists({_id: req.body.id_service}).catch((err) => {throw "Invalid service id"})) {
        throw "Invalid service id";
      }
      if(req.body.id_role && !await RoleSchema.exists({_id: req.body.id_role}).catch((err) => {throw "Invalid role id"})) {
        throw "Invalid role id";
      }

      serviceEmployee = await EmployeeSchema.findById(id).id_service;
      employee = await EmployeeSchema.findById(id);
      if (!employee) {
        throw "Invalid employee id";
      }

      if(req.file) {
        try {
          fs.unlinkSync(path.resolve(__dirname + "../../../public/uploads/"+employee.photo_url));
        } catch {}
        req.body.photo_url = req.file.filename;
      }

      updateKeys = Object.keys(req.body);
      updateKeys.forEach(key => (employee[key] = req.body[key]));

      await employee.save();

      res.send({
        message: `Employee (${id}) have been updated`,
      });
      if(serviceEmployee != req.body.id_service) {
        NotificationController.NewEmployeetoServiceToManager(id);
      }
    } catch (err) {
      try {
        fs.unlinkSync(path.resolve(__dirname + "../../../public/uploads/"+req.file.filename));
      } catch {}
      res.status(400).send({
        message: "Error when updating a employee",
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
        message: "Error when geting all employee",
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
        message: "Error when geting a employee by id",
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
      try {
        fs.unlinkSync(path.resolve(__dirname + "../../../public/uploads/"+employee.photo_url));
      } catch {}
      employee.remove();

      res.send({
        message: `Employee deleted`,
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when deleting a employee",
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
