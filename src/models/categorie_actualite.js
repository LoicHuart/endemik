const mongoose = require("mongoose");
const { Schema } = mongoose;

const categorieActualiteSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
    validate(value) {
      if (!validator.isMongoId(value)) {
        throw new Error("Problem with MongoDB Id");
      }
    },
  },
  title: {
    type: String,
    required: true,
    validate(value) {
      if (!validator.isEmpty(value)) {
        throw new Error("title cannot be empty");
      }
    },
  },
});

module.exports = mongoose.model(
  "categorie_actualite",
  categorieRessourceSchema,
  "categorie_actualite"
);

isMongoId;
