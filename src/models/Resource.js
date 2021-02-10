const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResourceSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  title: { type: String, required: true },
  date: { type: Date, required: true },
  doc_url: { type: String, required: true },
  active: { type: Boolean, required: true },
  id_categorie: { type: Schema.Types.ObjectId, required: true },
  id_author: { type: Schema.Types.ObjectId, required: true },
  id_service: { type: Schema.Types.ObjectId, default: null, required: true },
});

module.exports = mongoose.model("resource", ResourceSchema, "resource");
