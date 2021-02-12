const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategoryResourceSchema = new mongoose.Schema({
  titre: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model(
  "CategoryResource",
  CategoryResourceSchema,
  "CategoryResource"
);
