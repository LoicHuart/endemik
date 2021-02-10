var RessourceSchema = require("../models/Ressource");
var CategorieRessourceSchema = require("../models/Categorie_ressource");

var RessourceController = {
  async gestionDocument(req, res) {
    res.render("pages/gestionDesDocumentations/gestionDocument",{
      session: req.session
    });
  },

  async Documentation(req, res) {
    res.render("pages/documentation/Documentation",{
      session: req.session
    });
  },

};

module.exports = RessourceController;
