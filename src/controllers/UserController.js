var EmployeeSchema = require("../models/Employee");

var UserController = {
  async userManagement(req, res) {
    res.render("pages/UserManagement/UserManagement", {
      session: req.session,
    });
  },

  async pageAddUser(req, res) {
    res.render("pages/UserManagement/AddUser", {
      session: req.session,
    });
  },

  async addUser(req, res) {
    console.log(req.body);
    res.render("pages/UserManagement/AddUser", {
      session: req.session,
    });
    req.password = "toto";
    const user = new EmployeeSchema(req.body);
    try {
      console.log(user);
      await user.save();
      res.status(201).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },

  async editUser(req, res) {
    res.render("pages/UserManagement/EditUser", {
      session: req.session,
    });
  },

  async profilUser(req, res) {
    res.render("pages/UserManagement/Profil", {
      session: req.session,
    });
  },
};

module.exports = UserController;
