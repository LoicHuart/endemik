const mongoose = require('mongoose');
const { Schema } = mongoose;

const ressourceSchema = new mongoose.Schema({
    title:  String,
    date: String,
    url_doc: String,
    active: Boolean,
    id_categorie: Number,
    id_salarie_createur: Number,
    id_service: { type: Number, default: null }
});

module.exports = mongoose.model('ressource', ressourceSchema, 'ressource');  