const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new mongoose.Schema({
    name:  String, 
    site: String,
    id_responsable: Number
});

module.exports = mongoose.model('service', serviceSchema, 'service');  