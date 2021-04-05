const mongoose = require("mongoose");
const { Schema } = mongoose;

const HolidaySchema = new mongoose.Schema({
  note: {
    type: String,
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
  },
  validation_date: {
    type: Date,
    default: null,
  },
  type: {
    type: String,
    enum: ["rtt", "congés payés"],
    required: true,
  },
  status: {
    type: String,
    enum: ["en attente", "prévalidé", "validé", "refusé"],
    default: "en attente",
    required: true,
  },
  id_requester_employee: {
    type: Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
});

HolidaySchema.pre("save", async function (next) {
  this.current_date = await Date.now();
  next();
});

module.exports = mongoose.model("Holiday", HolidaySchema, "Holiday");
