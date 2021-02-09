const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    name:  String, 
    site: String,
    id_responsable: Schema.Types.ObjectId
});

module.exports = mongoose.model('service', serviceSchema, 'service');  