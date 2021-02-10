const mongoose = require('mongoose');
const { Schema } = mongoose;

const CategorieRessourceSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    titre:  { type: String, required: true },
});

module.exports = mongoose.model('categorie_ressource', CategorieRessourceSchema, 'categorie_ressource');  