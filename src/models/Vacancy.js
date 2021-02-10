const mongoose = require("mongoose");
const { Schema } = mongoose;

const VacancySchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  note: String,
  starting_date: { type: Date, required: true },
  ending_date: { type: Date, required: true },
  current_date: { type: Date, required: true },
  validation_date: { type: Date, default: null, required: true },
  type: { type: String, enum: ["rtt", "congés payés"], required: true },
  status: {
    type: String,
    enum: ["en attente", "prevalider", "valider", "refuser"],
    required: true,
  },
  id_requester_employee: { type: Schema.Types.ObjectId, required: true },
  id_manager: { type: Schema.Types.ObjectId, required: true },
  id_service: { type: Schema.Types.ObjectId, required: true },
});

module.exports = mongoose.model("Vacancy", VacancySchema, "Vacancy");
