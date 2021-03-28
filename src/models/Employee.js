const mongoose = require("mongoose");
const validator = require("validator");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");
const RoleSchema = require("../models/Role");
const ServiceSchema = require("../models/Service");

const EmployeeSchema = new mongoose.Schema({
  title: {
    type: String,
    lowercase: true,
    required: true,
  },
  lastName: {
    type: String,
    uppercase: true,
    required: true,
    trim: true,
  },
  firstName: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  date_birth: {
    type: Date,
    required: true,
  },
  social_security_number: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isLength(value, 12)) {
        throw new Error("Numéro de sécurité social n'est pas de la bonne taille (13)");
      }
      if (validator.isAlpha(value, "fr-FR")) {
        throw new Error(
          "Numéro de sécurité social ne doit pas contenir de caractères alphanumériques (A-Za-z)"
        );
      }
    },
  },
  mail: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Le format n'est pas un mail");
      }
    },
  },
  tel_nb: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isMobilePhone(value, "fr-FR")) {
        throw new Error("Le format n'est pas un téléphone portable");
      }
    },
  },
  postal_code: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      if (!validator.isLength(value, 4)) {
        throw new Error("Le format n'est pas un code postal (5)");
      }
      if (validator.isAlpha(value, "fr-FR")) {
        throw new Error("Le format n'est pas un code postal");
      }
    },
  },
  street_nb: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  arrival_date: {
    type: Date,
    required: true,
    trim: true,
  },
  children_nb: {
    type: Number,
    required: true,
  },
  password: {
    type: String,
    require: true,
  },
  photo_url: {
    type: String,
    default: null,
    trim: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  holiday_balance: {
    rtt: {
      type: Number,
      default: 0,
      required: false,
    },
    congesPayes: {
      type: Number,
      default: 0,
      required: false,
    }
  },
  id_service: {
    type: Schema.Types.ObjectId,
    ref: "Service",
    required: true,
  },
  id_role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: false,
  },
});

EmployeeSchema.pre("save", async function (next) {
  this.password = await bcrypt.hash(this.password, 10);

  next();
});

module.exports = mongoose.model("Employee", EmployeeSchema, "Employee");
