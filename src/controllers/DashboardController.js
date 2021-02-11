var EmployeeSchema = require("../models/Employee");

var DashboardController = {
  async dashboard(req, res) {
    res.render("pages/Dashboard/Dashboard", {
      session: req.session,
    });
  },

  async statisticsDashboard(req, res) {
    res.render("pages/StatisticsDashboard/StatisticsDashboard", {
      session: req.session,
    });
  },
};

module.exports = DashboardController;
