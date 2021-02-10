const mongoose = require("mongoose");
const { Schema } = mongoose;

const roleSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("role", roleSchema, "role");
