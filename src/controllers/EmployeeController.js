var Employee = require("../models/Employee");

var EmployeeController = {
  async addEmployee(req, res) {
    //req.password = "toto";
    try {
      const Employee = new Employee(req.body);
      console.log(Employee);
      await Employee.save();
      res.status(201).send(Employee);
    } catch (err) {
      res.status(400).send({
        message: "can't create the Employee",
      });
    }
  },

  async editEmployee(req, res) {
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
    Employee.findByIdAndUpdate(id, req.body)
      .then(() => {
        res.send({
          message: `Employee (${id}) have been updated`,
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },

  async getEmployees(_, res) {
    try {
      let employees = await Employee.find();
      res.send(employees);
    } catch (err) {
      res.status(500).send(err);
    }
  },

  async deleteEmployee(req, res) {
    const id = req.body._id;
    try {
      let employee = await Employee.findByIdAndDelete(id);
      res.send({
        message: `Employee deleted`,
      });
    } catch (error) {
      res.status(500).send(error);
    }
  },

  async getEmployeeById(req, res) {
    const id = req.body._id;
    const populate = req.query.populate;
    let employee;
    try {
      if (populate) {
        employee = await Employee.findById(id).populate("id_role");
        //add populate id_service
      } else {
        employee = await Employee.findById(id);
      }

      if (!employee) {
        return res.status(404).send({
          message: "Employee not found",
        });
      }
      res.send(employee);
    } catch (err) {
      res.status(500).send(err);
    }
    /* 
      let Employee = await Employee.findById();
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
};

function checkKeys(body, allowedKeys) {
  const updatedKeys = Object.keys(body);
  return updatedKeys.every((key) => allowedKeys.includes(key));
}
module.exports = EmployeeController;
