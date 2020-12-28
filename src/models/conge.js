const mongoose = require('mongoose');
const { Schema } = mongoose;

const congeSchema = new mongoose.Schema({
    note:  String,
    date_debut: String,
    date_fin: String,
    date_validation: { type: String, default: null },
    type: String,
    status: {type: String, enum: ['en attente', 'prevalider', 'valider', 'refuser'] },
    id_salarie_demande: Number,
    id_salarie_traitement: Number,
    id_service: Number
});

module.exports = mongoose.model('conge', congeSchema, 'conge');  