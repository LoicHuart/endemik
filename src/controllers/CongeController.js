var CongeSchema = require("../models/Conge");

var CongeController = {
  async gestionConge(req, res) {
    res.render("pages/gestionDesConges/gestionConge",{
      session: req.session
    });
  },

  async demandeDeConge(req, res) {
    res.render("pages/demandeDeConge/demandeConge",{
      session: req.session
    });
  },
};

module.exports = CongeController;
