var SalarieSchema = require("../models/Salarie");

var UtilisateurController = {
  async gestionUtilisateur(req, res) {
    res.render("pages/gestionDesUtilisateurs/gestionUtilisateur",{
      session: req.session
    });
  },

  async ajoutUtilisateur(req, res) {
    res.render("pages/gestionDesUtilisateurs/ajoutUtilisateur",{
      session: req.session
    });
  },

  async editionUtilisateur(req, res) {
    res.render("pages/gestionDesUtilisateurs/editionUtilisateur",{
      session: req.session
    });
  },

};

module.exports = UtilisateurController;
