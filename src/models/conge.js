const mongoose = require('mongoose');
const { Schema } = mongoose;

const CongeSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    note:  String,
    date_debut: { type: Date, required: true },
    date_fin: { type: Date, required: true },
    date_demande: { type: Date, required: true },
    date_validation: { type: Date, default: null, required: true },
    type: { type: String, enum: ['rtt', 'congés payés'], required: true },
    status: { type: String, enum: ['en attente', 'prevalider', 'valider', 'refuser'], required: true },
    id_salarie_demande: { type: Schema.Types.ObjectId, required: true },
    id_salarie_traitement: { type: Schema.Types.ObjectId, required: true },
    id_service: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('conge', CongeSchema, 'conge');  