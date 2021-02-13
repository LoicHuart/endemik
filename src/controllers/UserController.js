var Employee = require("../models/Employee");

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

  async pageProfil(req, res) {
    res.render("pages/UserManagement/Profil", {
      session: req.session,
    });
  },

  async pageEditUser(req, res) {
    res.render("pages/UserManagement/EditUser", {
      session: req.session,
    });
  },

  async addUser(req, res) {
    //req.password = "toto";
    try {
      const user = new Employee(req.body);
      await user.save();
      res.status(201).send(user);
    } catch (err) {
      res.status(400).send({
        message: "can't create the user",
      });
    }
  },

  async editUser(req, res) {
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
          message: `User (${id}) have been updated`,
        });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  },

  async getUserById(req, res) {
    try {
      let user = await await Employee.findById(req.body._id);
      console.log(user);
      if (!user) {
        return res.status(404).send({
          message: "user not found",
        });
      }
      res.send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  },
};

function checkKeys(body, allowedKeys) {
  const updatedKeys = Object.keys(body);
  return updatedKeys.every((key) => allowedKeys.includes(key));
}
module.exports = UserController;
