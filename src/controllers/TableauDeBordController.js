var SalarieSchema = require("../models/Salarie");

var TableauDeBordController = {
  async tableauDeBord(req, res) {
    res.render("pages/tableauDeBord/tableauDeBord",{
      session: req.session
    });
  },

  async tableauStatistique(req, res) {
    res.render("pages/tableauDeBordStatistique/tableauStatistique",{
      session: req.session
    });
  },

};

module.exports = TableauDeBordController;
