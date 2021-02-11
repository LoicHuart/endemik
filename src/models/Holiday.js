const mongoose = require("mongoose");
const { Schema } = mongoose;

const HolidaySchema = new mongoose.Schema({
  note: {
    type: String,
    required: true,
    trim: true,
  },
  starting_date: {
    type: Date,
    required: true,
  },
  ending_date: {
    type: Date,
    required: true,
  },
  current_date: {
    type: Date,
    required: true,
  },
  validation_date: {
    type: Date,
    default: null,
    required: true,
  },
  type: {
    type: String,
    enum: ["rtt", "congés payés"],
    required: true,
  },
  status: {
    type: String,
    enum: ["en attente", "prevalider", "valider", "refuser"],
    required: true,
  },
  id_requester_employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
});

module.exports = mongoose.model("Holiday", HolidaySchema, "Holiday");
