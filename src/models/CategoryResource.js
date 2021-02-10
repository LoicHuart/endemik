const mongoose = require("mongoose");
const { Schema } = mongoose;

const CategoryResourceSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  titre: { type: String, required: true },
});

module.exports = mongoose.model(
  "CategoryResource",
  CategoryResourceSchema,
  "CategoryResource"
);
