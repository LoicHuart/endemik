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
  async getAllServices(req, res) {
    const populate = parseInt(req.query.populate);
    let services;
    try {
      if (populate) {
        services = await ServiceSchema.find().populate("id_manager");
      } else {
        services = await ServiceSchema.find();
      }
      res.send(services);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting all services",
        error: err,
      });
    }
  },
  async deleteAllServices(req, res) {
    try {
      await ServiceSchema.deleteMany();
      res.send({
        message: `All services have been delete`,
      });
    } catch (error) {
      res.status(400).send({
        message: "Error when deleting all services",
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
