const mongoose = require('mongoose');
const { Schema } = mongoose;

const congeSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    note:  String,
    date_debut: String,
    date_fin: String,
    date_validation: { type: String, default: null },
    type: String,
    status: {type: String, enum: ['en attente', 'prevalider', 'valider', 'refuser'] },
    id_salarie_demande: Schema.Types.ObjectId,
    id_salarie_traitement: Schema.Types.ObjectId,
    id_service: Schema.Types.ObjectId
});

module.exports = mongoose.model('conge', congeSchema, 'conge');  