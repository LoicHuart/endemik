var ActualiteSchema = require("../models/actualite");
var CategActualiteSchema = require("../models/categorie_actualite");

var ActualiteController = {
  async index(req, res) {
    res.render("pages/gestionActualite");
  },
};

module.exports = ActualiteController;
