const mongoose = require('mongoose');
const { Schema } = mongoose;

const actualiteSchema = new mongoose.Schema({
    title:  String,
    contenu: String,
    date: String,
    url_image: String,
    active: Boolean,
    id_categorie: Number,
    id_salarie_createur: Number
});

module.exports = mongoose.model('actualite', actualiteSchema, 'actualite');  