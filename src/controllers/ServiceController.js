const ServiceSchema = require("../models/Service");
const EmployeeSchema = require("../models/Employee");

var ServiceController = {
  async addService(req, res) {
    try {
      if (!checkKeys(req.body, ["name", "site", "id_manager"])) {
        throw "Invalid keys";
      }

      employee = await EmployeeSchema.findById(req.body.id_manager);
      if (!employee) {
        throw "Invalid manager id";
      }

      serviceTest = await ServiceSchema.findOne(req.body.id_manager)
      if (!serviceTest) {
        throw `this employee is already a manager of the service ${serviceTest.name}`;
      }

      const service = new ServiceSchema(req.body);
      await service.save();

      employee.id_service = service._id;
      employee.save();

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
        services = await ServiceSchema.find(req.body).populate("id_manager");
      } else {
        services = await ServiceSchema.find(req.body);
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
    } catch (err) {
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

      employee = await EmployeeSchema.findById(req.body.id_manager);
      if (!employee && req.body.id_manager) {
        throw "Invalid manager id";
      }

      serviceTest = await ServiceSchema.findOne({ id_manager: req.body.id_manager })
      if (serviceTest) {
        throw `this employee is already a manager of the service ${serviceTest.name}`;
      }

      service = await ServiceSchema.findById(id);
      if (!service) {
        throw "Invalid service id";
      }
      updateKeys = Object.keys(req.body);
      updateKeys.forEach((key) => (service[key] = req.body[key]));
      await service.save();

      employee = await EmployeeSchema.findById(req.body.id_manager);
      employee.id_service = service._id;
      employee.save();

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
      if (populate) {
        service = await ServiceSchema.findById(id).populate("id_manager");
      } else {
        service = await ServiceSchema.findById(id);
      }

      if (!service) {
        throw "Invalid service id";
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
      service = await ServiceSchema.findById(id);
      if (service.name.toLowerCase() == "rh" || service.name.toLowerCase() == "direction") {
        throw "Cannot delete this service";
      }
      if (!service) {
        throw "Invalid service id";
      }

      employee = await EmployeeSchema.findOne({ id_service: id })
      if (employee) {
        throw "Cannot delete the service while employee is linked";
      }
      service.remove();

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
