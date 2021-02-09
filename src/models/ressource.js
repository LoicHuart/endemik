const mongoose = require('mongoose');
const { Schema } = mongoose;

const ressourceSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    title:  String,
    date: Date,
    url_doc: String,
    active: Boolean,
    id_categorie: Schema.Types.ObjectId,
    id_salarie_createur: Schema.Types.ObjectId,
    id_service: { type: Schema.Types.ObjectId, default: null }
});

module.exports = mongoose.model('ressource', ressourceSchema, 'ressource');  