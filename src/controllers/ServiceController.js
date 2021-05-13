const ServiceSchema = require("../models/Service");
const EmployeeSchema = require("../models/Employee");

var ServiceController = {
  async addService(req, res) {
    try {
      if (!checkKeys(req.body, ["name", "site", "id_manager"])) {
        throw { err: "Invalid keys", code: "36" };
      }

      if (req.body.name) {
        req.body.name = req.body.name.toLowerCase();
      }

      employee = await EmployeeSchema.findById(req.body.id_manager);
      if (!employee) {
        throw { err: "Invalid manager id", code: "37" };
      }

      serviceTestName = await ServiceSchema.findOne({ name: req.body.name })
      if (serviceTestName) {
        throw { err: `This service name is already use`, code: "38" };
      }

      serviceTest = await ServiceSchema.findOne({ id_manager: req.body.id_manager })
      if (serviceTest) {
        throw { err: `this employee is already a manager of the service ${serviceTest.name}`, code: "39" };
      }

      const service = new ServiceSchema(req.body);
      await service.save();

      employee.id_service = service._id;
      employee.isManager = true;
      await employee.save();

      res.send(service);
    } catch (err) {
      console.log(err)
      res.status(400).send({
        message: "Error when adding a service",
        error: err.err,
        code: err.code
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

      if (!services) {
        throw { err: `services not found`, code: "40" };
      }

      res.send(services);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting all services",
        error: err.err,
        code: err.code
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
        throw { err: "Invalid keys", code: "41" };
      }

      if (req.body.name) {
        req.body.name = req.body.name.toLowerCase();
      }

      service = await ServiceSchema.findById(id);
      if (!service) {
        throw { err: "Invalid service id", code: "42" };
      }

      employee = await EmployeeSchema.findById(req.body.id_manager);
      if (!employee) {
        throw { err: "Invalid manager id", code: "43" };
      }

      serviceTestName = await ServiceSchema.findOne({ name: req.body.name })
      if (serviceTestName && (serviceTestName.name != service.name)) {
        throw { err: `This service name is already use`, code: "44" };
      }

      serviceTest = await ServiceSchema.findOne({ id_manager: req.body.id_manager })
      if (serviceTest && (JSON.stringify(serviceTest.id_manager) != JSON.stringify(service.id_manager))) {
        throw { err: `this employee is already a manager of the service ${serviceTest.name}`, code: "45" };
      }

      oldManager = await EmployeeSchema.findById(service.id_manager);
      oldManager.isManager = false;
      oldManager.save();

      updateKeys = Object.keys(req.body);
      updateKeys.forEach((key) => (service[key] = req.body[key]));
      await service.save();

      employee = await EmployeeSchema.findById(req.body.id_manager);
      employee.id_service = service._id;
      employee.isManager = true;
      employee.save();

      res.send({
        message: `Service ${id} was updated !`,
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when updating a service",
        error: err.err,
        code: err.code
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
        throw { err: "Invalid service id", code: "46" };
      }

      res.send(service);
    } catch (err) {
      res.status(400).send({
        message: "Error when geting a service by id",
        error: err.err,
        code: err.code
      });
    }
  },

  async deleteService(req, res) {
    const id = req.params.id;
    try {
      service = await ServiceSchema.findById(id);
      if (!service) {
        throw { err: "Invalid service id", code: "47" };
      }
      if (service.name.toLowerCase() == "rh" || service.name.toLowerCase() == "direction") {
        throw { err: "Cannot delete this service", code: "48" };
      }

      employee = await EmployeeSchema.find({ id_service: id })
      if (employee) {
        employee.map(e => {
          console.log(e)
          if (JSON.stringify(e._id) != JSON.stringify(service.id_manager)) {
            throw { err: "Cannot delete the service while employee is linked", code: "49" };
          }
        });
      }
      service.remove();

      res.send({
        message: `Service deleted`,
      });
    } catch (err) {
      res.status(400).send({
        message: "Error when deleting a service",
        error: err.err,
        code: err.code
      });
    }
  },
};

function checkKeys(body, allowedKeys) {
  const updatesKeys = Object.keys(body);
  return updatesKeys.every((key) => allowedKeys.includes(key));
}
module.exports = ServiceController;
