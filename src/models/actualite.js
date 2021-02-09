const mongoose = require("mongoose");
const { Schema } = mongoose;

const actualiteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error("title cannot be empty");
      }
    },
  },
  contenu: {
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
    validate(value) {
      if (!validator.isMongoId(value)) {
        throw new Error("Problem with MongoDB Id");
      }
    },
  },
  id_salarie_createur: {
    type: Schema.Types.ObjectId,
    required: true,
    validate(value) {
      if (!validator.isMongoId(value)) {
        throw new Error("Problem with MongoDB Id");
      }
    },
  },
});

module.exports = mongoose.model("actualite", actualiteSchema, "actualite");
