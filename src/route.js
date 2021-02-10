var LoginController = require('./controllers/LoginController');

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

    
    app.get('/login',LoginController.index);
    app.post('/auth', LoginController.auth);
    app.get('/logout', LoginController.logout);
    

    app.get('/tableauDeBord', isLoggedIn, (req, res) => {
        res.render("pages/tableauDeBord/tableauDeBord",{
            session: req.session
        });
    }); 

    app.get('/demandeConge', isLoggedIn, (req, res) => {
        res.render("pages/demandeDeConge/demandeConge",{
            session: req.session
        });
    });   
    
    app.get('/documentation', isLoggedIn, (req, res) => {
        res.render("pages/documentation/documentation",{
            session: req.session
        });
    });  

    app.get('/tableauStatistique', isLoggedIn, (req, res) => {
        res.render("pages/tableauDeBordStatistique/tableauStatistique",{
            session: req.session
        });
    }); 

    app.get('/gestionConge', isLoggedIn, (req, res) => {
        res.render("pages/gestionDesConges/gestionConge",{
            session: req.session
        });
    }); 

    app.get('/gestionDocument', isLoggedIn, (req, res) => {
        res.render("pages/gestionDesDocumentations/gestionDocument",{
            session: req.session
        });
    }); 

    app.get('/gestionActualite', isLoggedIn, (req, res) => {
        res.render("pages/gestionDesActualites/gestionActualite",{
            session: req.session
        });
    }); 

    app.get('/gestionUtilisateur', isLoggedIn, (req, res) => {
        res.render("pages/gestionDesUtilisateurs/gestionUtilisateur",{
            session: req.session
        });
    }); 

    app.get('/ajoutUtilisateur', isLoggedIn, (req, res) => {
        res.render("pages/gestionDesUtilisateurs/ajoutUtilisateur",{
            session: req.session
        });
    }); 

    app.get('/editionUtilisateur', isLoggedIn, (req, res) => {
        res.render("pages/gestionDesUtilisateurs/editionUtilisateur",{
            session: req.session
        });
    }); 

};

module.exports =  initRoutes;
