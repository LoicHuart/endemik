const mongoose = require('mongoose');
const { Schema } = mongoose;

const RessourceSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    title: { type: String, required: true },
    date: { type: Date, required: true },
    url_doc: { type: String, required: true },
    active: { type: Boolean, required: true },
    id_categorie: { type: Schema.Types.ObjectId, required: true },
    id_salarie_createur: { type: Schema.Types.ObjectId, required: true },
    id_service: { type: Schema.Types.ObjectId, default: null, required: true }
});

module.exports = mongoose.model('ressource', RessourceSchema, 'ressource');  