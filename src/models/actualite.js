const mongoose = require('mongoose');
const { Schema } = mongoose;

const actualiteSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    title:  String,
    contenu: String,
    date: String,
    url_image: String,
    active: Boolean,
    id_categorie: Schema.Types.ObjectId,
    id_salarie_createur: Schema.Types.ObjectId
});

module.exports = mongoose.model('actualite', actualiteSchema, 'actualite');  