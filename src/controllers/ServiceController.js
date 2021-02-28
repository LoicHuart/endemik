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
  async updateService(req, res) {
    const id = req.params.id;
    try {
      if (!checkKeys(req.body, ["name", "site", "id_manager"])) {
        throw "Invalid keys";
      }

      if (
        id &&
        !(await ServiceSchema.exists({ _id: id }).catch((err) => {
          throw "Invalid service id";
        }))
      ) {
        throw "Invalid service id";
      }
      if (
        req.body.id_manager &&
        !(await EmployeeSchema.exists({
          _id: req.body.id_manager,
        }).catch((err) => {
          throw "Invalid manager id";
        }))
      ) {
        throw "Invalid manager id";
      }

      ServiceSchema.findByIdAndUpdate(id, req.body);
      res.send({
        message: `Service ${id} was updated !`,
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when updating a service",
        error: err,
      });
    }
  },
  async getServiceByID(req, res) {
    const id = req.params.id;
    const populate = parseInt(req.query.populate);
    let service;
    try {
      if (
        id &&
        !(await ServiceSchema.exists({ _id: id }).catch((err) => {
          throw "Invalid service id";
        }))
      ) {
        throw "Invalid service id";
      }
      if (populate) {
        service = await ServiceSchema.findById(id).populate("id_manager");
      } else {
        service = await ServiceSchema.findById(id);
      }
      res.send(service);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting a service by id",
        error: err,
      });
    }
  },
  async deleteService(req, res) {
    const id = req.params.id;
    try {
      if (
        id &&
        !(await ServiceSchema.exists({ _id: id }).catch((err) => {
          throw "Invalid service id";
        }))
      ) {
        throw "Invalid service id";
      }

      await ServiceSchema.findByIdAndDelete(id);
      res.send({
        message: `Service deleted`,
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when deleting a service",
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
