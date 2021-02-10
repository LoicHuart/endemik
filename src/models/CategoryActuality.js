const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const CategoryActualitySchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
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
  "categoryActuality",
  CategoryActualitySchema,
  "categoryActuality"
);
