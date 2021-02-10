const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const ActualitySchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  url_image: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURI(value)) {
        throw new Error("format of the image is false");
      }
    }
  },
  active: {
    type: Boolean,
    required: true
  },
  id_categorie: { 
    type: Schema.Types.ObjectId, 
    ref: 'categoryActuality', 
    required: true 
  },
  id_author: { 
    type: Schema.Types.ObjectId, 
    ref: 'Employee', 
    required: true 
  },
});

module.exports = mongoose.model("actuality", ActualitySchema, "actuality");
