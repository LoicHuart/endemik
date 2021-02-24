const EmployeeSchema = require("../models/Employee");
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
        throw{
          error: "invalid keys",
        };
      }
      const Employee = new EmployeeSchema(req.body);
      await Employee.save();
      res.status(201).send(Employee);
      NotificationController.NewEmployeetoServiceToManager(Employee.id);
      NotificationController.NewEmployeeRegistedToDirection(Employee.id);
    } catch (err) {
      res.status(400).send({
        message: "can't create the Employee",
        error: err
      });
    }
  },

  async updateEmployee(req, res) {
    const id = req.params.id;
    if (
      !checkKeys(req.body, [
        "_id",
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
      return res.status(400).send({
        error: "invalid key",
      });
    }
    EmployeeSchema.findByIdAndUpdate(id, req.body)
      .then(() => {
        res.send({
          message: `Employee (${id}) have been updated`,
        });
      })
      .catch((err) => res.status(500).send(err));
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
      res.status(500).send(err);
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
        return res.status(404).send({
          message: "employee not found",
        });
      }
      res.send(employee);
    } catch (err) {
      res.status(500).send(err);
    }


   
   
    /* 
      let Employee = await EmployeeSchema.findById();
      console.log(Employee);
      if (!Employee) {
        return res.status(404).send({
          message: "Employee not found",
        });
      }
      res.send(Employee);
    } catch (err) {
      res.status(400).send(err);
    }*/
  },

  async deleteEmployee(req, res) {
    const id = req.params.id;
    try {
      await EmployeeSchema.findByIdAndDelete(id);
      res.send({
        message: `Employee deleted`,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },
};

function checkKeys(body, allowedKeys) {
  const updatedKeys = Object.keys(body);
  return updatedKeys.every((key) => allowedKeys.includes(key));
}
module.exports = EmployeeController;
