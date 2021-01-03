var loginController = require('./controllers/loginController');

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

    app.get('/login', loginController.index);
    
    app.post('/auth', loginController.auth);

    app.get('/logout', loginController.logout);

    app.get('/tableauDeBord', isLoggedIn, (req, res) => {
        res.render("pages/tableauDeBord",{
            session: req.session
        });
    });
    
    app.get('/demandeConge', isLoggedIn, (req, res) => {
        res.render("pages/demandeConge",{
            session: req.session
        });
    });   
    
    app.get('/documentation', isLoggedIn, (req, res) => {
        res.render("pages/documentation",{
            session: req.session
        });
    });  

    app.get('/tableauStatistique', isLoggedIn, (req, res) => {
        res.render("pages/tableauStatistique",{
            session: req.session
        });
    }); 

    app.get('/gestionConge', isLoggedIn, (req, res) => {
        res.render("pages/gestionConge",{
            session: req.session
        });
    }); 

    app.get('/gestionDocument', isLoggedIn, (req, res) => {
        res.render("pages/gestionDocument",{
            session: req.session
        });
    }); 

    app.get('/gestionActualite', isLoggedIn, (req, res) => {
        res.render("pages/gestionActualite",{
            session: req.session
        });
    }); 

    app.get('/gestionUtilisateur', isLoggedIn, (req, res) => {
        res.render("pages/gestionUtilisateur",{
            session: req.session
        });
    }); 

    app.get('/ajoutUtilisateur', isLoggedIn, (req, res) => {
        res.render("pages/ajoutUtilisateur",{
            session: req.session
        });
    }); 

    app.get('/editionUtilisateur', isLoggedIn, (req, res) => {
        res.render("pages/editionUtilisateur",{
            session: req.session
        });
    }); 
};

module.exports =  initRoutes;
