const express = require("express");
const router = new express.Router();
const LoginController = require("../controllers/LoginController");
const isLoggedIn = require("../middlewares/isLoggedIn");

router.route("/auth")
  .post(LoginController.auth);

module.exports = router;
