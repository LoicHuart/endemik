const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const CategoryActualitySchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: true,
    trim: true
  },
});

module.exports = mongoose.model("CategoryActuality", CategoryActualitySchema, "CategoryActuality");
