var SalarieSchema = require("../models/salarie");

var LoginController = {
  async index(req, res) {
    res.render("pages/login/login");
  },

  async auth(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {
      SalarieSchema.find(
        { mail: email, mdp: password },
        function (error, results, fields) {
          if (results.length > 0) {
            req.session.loggedin = true;
            req.session.user = results[0];
            res.redirect("/tableauDeBord");
          } else {
            res.render("pages/login/login", {
              error: "Email ou mot de passe incorrect",
            });
          }
          res.end();
        }
      );
    } else {
      res.render("pages/login/login", {
        error: "Entrer une adresse Email et un mot de passe s'il vous plaît",
      });
      res.end();
    }
  },

  async logout(req, res) {
    res.clearCookie("myCookie");

    req.session.destroy((err) => {
      res.redirect("/");
    });
  },
};

module.exports = LoginController;
