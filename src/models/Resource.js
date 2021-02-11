const mongoose = require("mongoose");
const { Schema } = mongoose;

const ResourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  date: {
    type: Date,
    required: true,
    trim: true,
  },
  doc_url: {
    type: String,
    required: true,
    trim: true,
  },
  active: {
    type: Boolean,
    required: true,
    trim: true,
  },
  id_categorie: {
    type: Schema.Types.ObjectId,
    ref: "CategoryResource",
    required: true,
  },
  id_author: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  id_service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
});

module.exports = mongoose.model("Resource", ResourceSchema, "Resource");
