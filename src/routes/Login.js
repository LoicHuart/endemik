const express = require("express");
const router = new express.Router();
const LoginController = require("../controllers/LoginController");


router.route("/auth")
    .post(LoginController.auth);

router.route("/logout")
    .get(LoginController.logout);

/*router.route("/forgotpassword")
    .post(LoginController.ForgotPassword);*/

module.exports = router;
