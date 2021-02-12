const bcrypt = require('bcrypt');
const { render } = require('ejs');
var EmployeeSchema = require("../models/Employee");
var jwt = require('jsonwebtoken');

var LoginController = {
  async login(req, res) {
    res.render("pages/Login/Login");
  },

  async auth(req, res, next) {
    var email = req.body.email;
    var password = req.body.password;

    try {
      let employee = await EmployeeSchema.findOne({ 
        mail: email 
      });
      if (!employee) {
        throw new Error();
      }

      let match = bcrypt.compareSync(password, employee.password);
      if (!match) {
        throw new Error();
      }
      
      token = jwt.sign({
        user_id: employee._id
      }, process.env.SECRET_JWT, {expiresIn: 60*60});
      err = {
          status: 200
      };
      next();
    } catch (error) {
       err = {
        message: "Email ou mot de passe incorrect",
        status: 401
      };
      next();
    }
  },

  async logout(req, res) {
    res.clearCookie("myCookie");

    req.session.destroy((err) => {
      res.redirect("/");
    });
  },
};

module.exports = LoginController;
