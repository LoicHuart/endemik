const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorieRessourceSchema = new mongoose.Schema({
    titre:  String,
});

module.exports = mongoose.model('categorie_ressource', categorieRessourceSchema, 'categorie_ressource');  