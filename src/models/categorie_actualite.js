const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorieActualiteSchema = new mongoose.Schema({
    titre:  String,
});

module.exports = mongoose.model('categorie_actualite', categorieRessourceSchema, 'categorie_actualite');  