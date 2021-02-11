var CongeSchema = require("../models/Vacancy");

var VacancyController = {
  async vacancyManagement(req, res) {
    res.render("pages/VacancyManagement/VacancyManagement", {
      session: req.session,
    });
  },

  async vacancyRequest(req, res) {
    res.render("pages/VacancyRequest/VacancyRequest", {
      session: req.session,
    });
  },
};

module.exports = VacancyController;
