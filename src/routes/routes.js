var LoginController = require("../controllers/LoginController");
var ActualityController = require("../controllers/ActualityController");
var ResourceController = require("../controllers/ResourceController");
var UserController = require("../controllers/UserController");
var DashboardController = require("../controllers/DashboardController");
var HolidayController = require("../controllers/HolidayController");

var EmployeeSchema = require("./models/Employee");
var jwt = require('jsonwebtoken');

async function isLoggedIn(req, res, next) {
  try {
    const token = req.session.token;
    // "Bearer xxxxxxxxxxxxxxxxxxxxxxxxxxxx" => "xxxxxxxxxxxxxxxxxxxxxxxxxxxx"
    const decoded = jwt.verify(token, process.env.SECRET_JWT);
    const user = await EmployeeSchema.findById(decoded.user_id);
    if (!user) {
      throw new Error();
    }
    req.session.user = user;
    next();
  } catch (error) {
    res.status(401).send({
      message: error,
    });
  }
}

function initRoutes(app) {
  app.get("/", (req, res) => {
    res.redirect("/login");
  });

  app.get("/login", LoginController.login);
  app.post("/auth", LoginController.auth, 
  (req, res) => {
    if ( err.status === 200) {
      req.session.token = token;
      res.redirect("/tableauDeBord");
    }else{
      res.render("pages/Login/Login", { error: err.message });
    }
  });

  app.post("/api/auth", LoginController.auth, 
  (req, res) => {
    if ( err.status === 200) {
      res.status(200).send(token);
    }else{
      res.status(401).send(err.message);

    }
  });


  app.get("/logout", LoginController.logout);

  app.get("/tableauDeBord", isLoggedIn, DashboardController.dashboard);

  //app.get("/demandeConge", isLoggedIn, HolidayController.holidayRequest);

  app.get("/documentation", isLoggedIn, ResourceController.resource);

  app.get(
    "/tableauStatistique",
    isLoggedIn,
    DashboardController.statisticsDashboard
  );

  //app.get("/gestionConge", isLoggedIn, HolidayController.holidayManagement);

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

  app.post("/ajoutUtilisateur", isLoggedIn, UserController.addUser);

  app.get("/pageAjoutUtilisateur", isLoggedIn, UserController.pageAddUser);

  app.get("/editionUtilisateur", isLoggedIn, UserController.editUser);

  app.get("/profil", isLoggedIn, UserController.profilUser);
}

module.exports = initRoutes;
