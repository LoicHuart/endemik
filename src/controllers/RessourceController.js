var RessourceSchema = require("../models/Ressource");
var CategRessourceSchema = require("../models/Categorie_ressource");

var RessourceController = {
  async index(req, res) {
    res.render("pages/gestionDesDocumentation/gestionDocument",{
      session: req.session
    });
  },
};

module.exports = RessourceController;
