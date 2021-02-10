const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;

const ServiceSchema = new mongoose.Schema({
  _id: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  name: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error("name cannot be empty");
      }
    },
  },
  site: {
    type: String,
    required: true,
    validate(value) {
      if (validator.isEmpty(value)) {
        throw new Error("site cannot be empty");
      }
    },
  },
  id_manager: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = mongoose.model("service", ServiceSchema, "service");
