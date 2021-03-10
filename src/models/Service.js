const mongoose = require("mongoose");
const { Schema } = mongoose;

const ServiceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  site: {
    type: String,
    required: true,
    trim: true,
  },
  id_manager: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
});

module.exports = mongoose.model("Service", ServiceSchema, "Service");
