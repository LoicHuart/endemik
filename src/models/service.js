const mongoose = require('mongoose');
const { Schema } = mongoose;

const serviceSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
    name:  { type: String, required: true }, 
    site: { type: String, required: true },
    id_responsable: { type: Schema.Types.ObjectId, required: true }
});

module.exports = mongoose.model('service', serviceSchema, 'service');  