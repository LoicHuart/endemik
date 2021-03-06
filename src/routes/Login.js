const express = require("express");
const router = new express.Router();
const LoginController = require("../controllers/LoginController");
const isLoggedIn = require("../middlewares/isLoggedIn");
const hasAccessRole = require("../middlewares/hasAccessRole");

router.route("/auth").post(LoginController.auth);

router.route("/logout").get(LoginController.logout);

module.exports = router;
