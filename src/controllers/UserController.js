var EmployeeSchema = require("../models/Employee");

var UserController = {
  async userManagement(req, res) {
    res.render("pages/UserManagement/UserManagement", {
      session: req.session,
    });
  },

  async addUser(req, res) {
    res.render("pages/UserManagement/AddUser", {
      session: req.session,
    });
  },

  async editUser(req, res) {
    res.render("pages/UserManagement/EditUser", {
      session: req.session,
    });
  },
};

module.exports = UserController;
