const jwt = require('jsonwebtoken');
const EmployeeSchema = require("../models/Employee");

const isLoggedIn = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    const employee = await EmployeeSchema.findOne({ _id: decoded._id })
      .populate("id_service")
      .populate("id_role");

    if (!employee) {
      throw  "Invalid employee id";
    }

    req.token = token;
    req.employee = employee;
    next();
  } catch (err) {
    res.status(401).send({ error: 'Please authenticate' });
  }
};

module.exports = isLoggedIn;
