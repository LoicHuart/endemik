const mongoose = require('mongoose');
const { Schema } = mongoose;

const categorieActualiteSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    titre:  String,
});

module.exports = mongoose.model('categorie_actualite', categorieRessourceSchema, 'categorie_actualite');  