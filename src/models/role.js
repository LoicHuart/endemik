const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoleSchema = new mongoose.Schema({
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

module.exports = mongoose.model("Role", RoleSchema, "Role");
