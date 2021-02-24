const bcrypt = require('bcrypt');
const EmployeeSchema = require("../models/Employee");
const jwt = require('jsonwebtoken');

var LoginController = {
  async auth(req, res) {
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
        employee_id: employee._id
      }, process.env.SECRET_JWT, {expiresIn: 60*60});

      res.send({
        token: token,
      });
    } catch (error) {
      res.status(401).send("Email ou mot de passe incorrect");
    }
  },
};

module.exports = LoginController;
