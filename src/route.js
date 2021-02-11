var LoginController = require("./controllers/LoginController");
var ActualityController = require("./controllers/ActualityController");
var ResourceController = require("./controllers/ResourceController");
var UserController = require("./controllers/UserController");
var DashboardController = require("./controllers/DashboardController");
var VacancyController = require("./controllers/VacancyController");

function isLoggedIn(req, res, next) {
  if (req.session.loggedin === true) {
    return next();
  }
  res.redirect("/");
}

function initRoutes(app) {
  app.get("/", (req, res) => {
    res.redirect("/login");
  });

  app.get("/login", LoginController.login);
  app.post("/auth", LoginController.auth);
  app.get("/logout", LoginController.logout);

  app.get("/tableauDeBord", isLoggedIn, DashboardController.dashboard);

  app.get("/demandeConge", isLoggedIn, VacancyController.vacancyRequest);

  app.get("/documentation", isLoggedIn, ResourceController.resource);

  app.get(
    "/tableauStatistique",
    isLoggedIn,
    DashboardController.statisticsDashboard
  );

  app.get("/gestionConge", isLoggedIn, VacancyController.vacancyManagement);

  app.get(
    "/gestionDocument",
    isLoggedIn,
    ResourceController.resourceManagement
  );

  app.get(
    "/gestionActualite",
    isLoggedIn,
    ActualityController.actualityManagement
  );

  app.get("/gestionUtilisateur", isLoggedIn, UserController.userManagement);

  app.get("/ajoutUtilisateur", isLoggedIn, UserController.addUser);

  app.get("/editionUtilisateur", isLoggedIn, UserController.editUser);

  app.get("/profil", isLoggedIn, UserController.profilUser);
}

module.exports = initRoutes;
