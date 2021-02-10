const mongoose = require("mongoose");
const { Schema } = mongoose;
const validator = require("validator");

const salarieSchema = new mongoose.Schema({
  nom: {
    type: String,
    uppercase: true,
    required: true,
    trim: true,
  },
  prenom: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
  },
  date_nais: {
    type: Date,
    required: true,
  },
  num_secu: {
    type: String,
    require: true,
    validate(value) {
      if (validator.isLength(value, 13)) {
        throw new Error("Numéro de sécu n'est pas de la bonne taille (13)");
      }
      if (validator.isAlpha(value, "fr-FR")) {
        throw new Error(
          "Numéro de sécu ne doit pas contenir de caractères alphanumériques (A-Za-z)"
        );
      }
    },
  },
  mail: {
    type: String,
    require: true,
    validate(value) {
      if (validator.isEmail(value)) {
        throw new Error("Le format n'est pas un mail");
      }
    },
  },
  tel: {
    type: String,
    require: true,
    validate(value) {
      if (validator.isMobilePhone(value, "fr-FR")) {
        throw new Error("Le format n'est pas un téléphone portable");
      }
    },
  },
  code_postal: {
    type: String,
    require: true,
    validate(value) {
      if (validator.isPostalCode(value, "fr-FR")) {
        throw new Error("Le format n'est pas un code postal");
      }
    },
  },
  num_rue: {
    type: String,
    require: true,
  },
  rue: {
    type: String,
    require: true,
  },
  ville: {
    type: String,
    require: true,
  },
  date_arrivee: {
    type: Date,
    require: true,
  },
  nb_enfant: {
    type: Number,
    require: true,
  },
  mdp: {
    type: String,
    require: true,
  },
  url_photo: {
    type: String,
    default: null,
  },
  id_service: {
    type: Schema.Types.ObjectId,
    require: true,
  },
  id_role: {
    type: Schema.Types.ObjectId,
    require: true,
  },
});

module.exports = mongoose.model("salarie", salarieSchema, "salarie");
