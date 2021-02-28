const express = require("express");
const router = new express.Router();
const EmployeeController = require("../controllers/EmployeeController");
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

var upload = multer({ storage });


router.route("/employees")
  .post(upload.single('photo') ,EmployeeController.addEmployee)
  .get(EmployeeController.getAllEmployees);
    
router.route("/employees/:id")
  .put(upload.single('photo'), EmployeeController.updateEmployee)
  .delete(EmployeeController.deleteEmployee)
  .get(EmployeeController.getEmployeeById);



module.exports = router;
