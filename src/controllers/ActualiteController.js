var ActualiteSchema = require("../models/Actualite");
var CategActualiteSchema = require("../models/Categorie_actualite");

var ActualiteController = {
  async gestionActualite(req, res) {
    res.render("pages/gestionDesActualites/gestionActualite",{
      session: req.session
    });
  },
};

module.exports = ActualiteController;
