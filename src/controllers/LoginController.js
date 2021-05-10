const bcrypt = require("bcrypt");
const EmployeeSchema = require("../models/Employee");
const jwt = require("jsonwebtoken");
const { ForgotPassword } = require("./NotificationController");

var LoginController = {
  async auth(req, res) {
    var email = req.body.email;
    var password = req.body.password;

    try {
      let employee = await EmployeeSchema.findOne({
        mail: email,
        active: true
      });
      if (!employee) {
        throw new Error();
      }

      let match = bcrypt.compareSync(password, employee.password);
      if (!match) {
        throw new Error();
      }

      token = jwt.sign(
        {
          _id: employee._id,
        },
        process.env.SECRET_JWT,
        { expiresIn: 60 * 60 }
      );

      res.send({
        token: token,
      });
    } catch (err) {
      res.status(401).send({
        message: "error when connection",
        error: "Incorrect email or password",
        code: "34",
      });
    }
  },

  async logout(req, res) {
    var id = req.body.id;
    try {
      const token = req.body.token;
      token = "";
      res.send({
        token: token,
      });
    } catch (error) {
      res.status(401).send({
        message: "error when disconnection",
        error: "Can't logout",
        code: "35",
      });
    }
  },
};

module.exports = LoginController;
