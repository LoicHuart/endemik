var LoginController = require('./controllers/LoginController');
var ActualiteController = require('./controllers/ActualiteController');
var RessourceController = require('./controllers/RessourceController');
var UtilisateurController = require('./controllers/UtilisateurController');
var TableauDeBordController = require('./controllers/TableauDeBordController');
var CongeController = require('./controllers/CongeController');



function isLoggedIn(req, res, next) {
    if (req.session.loggedin === true){
        return next();
    }
    res.redirect('/');
}

function initRoutes(app) {

    app.get('/', (req, res) => {
        res.redirect('/login');
    });

    
    app.get('/login',LoginController.login);
    app.post('/auth', LoginController.auth);
    app.get('/logout', LoginController.logout);
    
    app.get('/tableauDeBord', isLoggedIn, TableauDeBordController.tableauDeBord);

    app.get('/demandeConge', isLoggedIn, CongeController.demandeDeConge);

    app.get('/documentation', isLoggedIn, RessourceController.Documentation);

    app.get('/tableauStatistique', isLoggedIn, TableauDeBordController.tableauStatistique);

    app.get('/gestionConge', isLoggedIn, CongeController.gestionConge);

    app.get('/gestionDocument', isLoggedIn, RessourceController.gestionDocument);

    app.get('/gestionActualite', isLoggedIn, ActualiteController.gestionActualite);

    app.get('/gestionUtilisateur', isLoggedIn, UtilisateurController.gestionUtilisateur);

    app.get('/ajoutUtilisateur', isLoggedIn, UtilisateurController.ajoutUtilisateur);

    app.get('/editionUtilisateur', isLoggedIn, UtilisateurController.editionUtilisateur);

};

module.exports =  initRoutes;
