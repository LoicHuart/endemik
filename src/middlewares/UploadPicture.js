const slugify = require('slugify');
const bcrypt = require("bcrypt");

const multer = require('multer');
const path = require('path');

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `./public/uploads/`);
  },
  filename: async function(req, file, cb) {
    cb(null, slugify(bcrypt.hashSync(file.originalname, 10)) + "." + file.mimetype.split("/")[1]);
  }
});

var UploadPicture = multer({ storage });


module.exports = UploadPicture;
