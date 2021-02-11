var ActualitySchema = require("../models/Actuality");
var CategActualitySchema = require("../models/CategoryActuality");

var ActualityController = {
  async actualityManagement(req, res) {
    res.render("pages/ActualityManagement/ActualityManagement", {
      session: req.session,
    });
  },
};

module.exports = ActualityController;
