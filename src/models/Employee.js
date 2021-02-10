const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const EmployeeSchema = new mongoose.Schema({
  _id: Schema.Types.ObjectId,
  lastName: {
    type: String,
    uppercase: true,
    required: true,
    trim: true
  },
  firstName: {
    type: String,
    lowercase: true,
    required: true,
    trim: true
  },
  date_birth: {
    type: Date,
    required: true
  },
  social_security_number: {
    type: String,
    require: true,
    trim: true,
    validate(value) {
      if (validator.isLength(value, 13)) {
        throw new Error("Numéro de sécu n'est pas de la bonne taille (13)");
      }
      if (validator.isAlpha(value, "fr-FR")) {
        throw new Error(
          "Numéro de sécu ne doit pas contenir de caractères alphanumériques (A-Za-z)"
        );
      }
    }
  },
  mail: {
    type: String,
    require: true,
    trim: true,
    validate(value) {
      if (validator.isEmail(value)) {
        throw new Error("Le format n'est pas un mail");
      }
    }
  },
  tel_nb: {
    type: String,
    require: true,
    trim: true,
    validate(value) {
      if (validator.isMobilePhone(value, "fr-FR")) {
        throw new Error("Le format n'est pas un téléphone portable");
      }
    }
  },
  postal_code: {
    type: String,
    require: true,
    trim: true,
    validate(value) {
      if (validator.isPostalCode(value, "fr-FR")) {
        throw new Error("Le format n'est pas un code postal");
      }
    }
  },
  street_nb: {
    type: String,
    require: true,
    trim: true
  },
  street: {
    type: String,
    require: true,
    trim: true
  },
  city: {
    type: String,
    require: true,
    trim: true
  },
  arrival_date: {
    type: Date,
    require: true,
    trim: true
  },
  children_nb: {
    type: Number,
    require: true,
    trim: true
  },
  password: {
    type: String,
    require: true,
    trim: true
  },
  photo_url: {
    type: String,
    default: null,
    trim: true
  },
  id_service: { 
    type: Schema.Types.ObjectId, 
    ref: 'Service', 
    required: true 
  },
  id_role: { 
    type: Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  },
});

module.exports = mongoose.model("Employee", EmployeeSchema, "Employee");
