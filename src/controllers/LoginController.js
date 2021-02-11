var EmployeeSchema = require("../models/Employee");

var LoginController = {
  async login(req, res) {
    res.render("pages/Login/Login");
  },

  async auth(req, res) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {
      EmployeeSchema.find(
        { mail: email, password: password },
        function (error, results, fields) {
          if (results.length > 0) {
            req.session.loggedin = true;
            req.session.user = results[0];
            res.redirect("/tableauDeBord");
          } else {
            res.render("pages/Login/Login", {
              error: "Email ou mot de passe incorrect",
            });
          }
          res.end();
        }
      );
    } else {
      res.render("pages/Login/Login", {
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
