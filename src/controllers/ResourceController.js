var ResourceSchema = require("../models/Resource");
var CategoryResourceSchema = require("../models/CategoryResource");

var ResourceController = {
  async resourceManagement(req, res) {
    res.render("pages/ResourceManagement/ResourceManagement", {
      session: req.session,
    });
  },

  async resource(req, res) {
    res.render("pages/Resource/Resource", {
      session: req.session,
    });
  },
};

module.exports = ResourceController;
