const mongoose = require("mongoose");
const { Schema } = mongoose;

const RoleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = mongoose.model("Role", RoleSchema, "Role");
