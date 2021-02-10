var RessourceSchema = require("../models/ressource");
var CategRessourceSchema = require("../models/categorie_ressource");

var RessourceController = {
  async index(req, res) {
    res.render("pages/gestionDocument");
  },
};

module.exports = RessourceController;
