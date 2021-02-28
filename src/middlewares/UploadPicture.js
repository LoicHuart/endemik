const slugify = require('slugify');
const bcrypt = require("bcrypt");
const imagemin = require('imagemin');
const imageminWebp = require('imagemin-webp');
const multer = require('multer');

// async function imageToWebp(image,imagemin) {
//   await imagemin(image, 'build/images', {
//       use: [
//           imageminWebp({quality: 50})
//       ]
//   });

//   console.log('Images optimized');
// };

var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, `./public/uploads/`);
  },
  filename: async function(req, file, cb) {
    cb(null, slugify(bcrypt.hashSync(file.originalname, 10)) + ".webp");
  }
});

var UploadPicture = multer({ storage });


module.exports = UploadPicture;
