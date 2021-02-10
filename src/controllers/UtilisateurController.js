var UtilisateurSchema = require("../models/salarie");

var UtilisateurController = {
  async index(req, res) {
    res.render("pages/gestionDesUtilisateurs/gestionUtilisateur",{
      session: req.session
    });
  },
};

module.exports = UtilisateurController;
