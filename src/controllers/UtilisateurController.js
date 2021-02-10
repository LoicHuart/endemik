var UtilisateurSchema = require("../models/salarie");

var UtilisateurController = {
  async index(req, res) {
    res.render("pages/gestionUtilisateur");
  },
};

module.exports = UtilisateurController;
