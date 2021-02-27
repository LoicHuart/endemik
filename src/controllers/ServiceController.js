const ServiceSchema = require("../models/Service");
const EmployeeSchema = require("../models/Employee");

var ServiceController = {
  async addService(req, res) {
    try {
      if (!checkKeys(req.body, ["name", "site", "id_manager"])) {
        throw "Invalid keys";
      }

      if (
        req.body.id_manager &&
        !(await EmployeeSchema.exists({ _id: req.body.id_manager }).catch(
          (err) => {
            throw "Invalid manager id";
          }
        ))
      ) {
        throw "Invalid manager id";
      }
      const service = new ServiceSchema(req.body);
      await service.save();
      res.status(201).send(service);
    } catch (err) {
      res.status(400).send({
        message: "Error when adding a service",
        error: err,
      });
    }
  },
};

function checkKeys(body, allowedKeys) {
  const updatesKeys = Object.keys(body);
  return updatesKeys.every((key) => allowedKeys.includes(key));
}
module.exports = ServiceController;
