const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const ActualitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error("title cannot be empty");
      }
    },
  },
  content: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error("content cannot be empty");
      }
    },
  },
  date: {
    type: Date,
    required: true,
    validate(value) {
      if (!validator.isDate(value)) {
        throw new Error("format of the date is false");
      }
    },
  },
  url_image: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isURI(value)) {
        throw new Error("format of the image is false");
      }
    },
  },
  active: {
    type: Boolean,
  },
  id_categorie: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  id_author: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("actuality", ActualitySchema, "actuality");
