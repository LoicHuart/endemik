const Employee = require("../../controllers/UserController");

function employeeRoutes(app) {
  app
    .post("/api/employees", Employee.addUser)
    .get("/api/employees", Employee.getUserById)
    .post("/api/employees/:id", Employee.editUser)
    .get("/api/employees/all", Employee.getEmployees)
    .delete("/api/employees/:id", Employee.deleteEmployee);
}

module.exports = employeeRoutes;
