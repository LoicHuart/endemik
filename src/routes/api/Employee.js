const Employee = require("../../controllers/UserController");

function employeeRoutes(app) {
  app.post("/employees", Employee.addUser);
}

module.exports = employeeRoutes;
