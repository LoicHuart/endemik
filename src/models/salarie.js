const mongoose = require('mongoose');
const { Schema } = mongoose;

const salarieSchema = new mongoose.Schema({
    nom:  String, 
    prenom: String,
    date_nais: String,
    num_secu: String,
    mail: String,
    tel: String,
    code_postal: String,
    num_rue: String,
    rue: String,
    ville: String,
    date_arrivee: String,
    nb_enfant: Number,
    mdp: String,
    url_photo: { type: String, default: null },
    id_service: Number
});

module.exports = mongoose.model('salarie', salarieSchema, 'salarie');  