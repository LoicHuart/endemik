var loginController = require('./controllers/loginController');

function initRoutes(app) {

    app.get('/', (req, res) => {
        res.redirect('/login');
    });

    
    app.get('/login',loginController.index);
    

    app.get('/tableauDeBord', (req, res) => {
        res.render("pages/tableauDeBord");
    }); 

    app.get('/demandeConge', (req, res) => {
        res.render("pages/demandeConge");
    });   
    
    app.get('/documentation', (req, res) => {
        res.render("pages/documentation");
    });  

    app.get('/tableauStatistique', (req, res) => {
        res.render("pages/tableauStatistique");
    }); 

    app.get('/gestionConge', (req, res) => {
        res.render("pages/gestionConge");
    }); 

    app.get('/gestionDocument', (req, res) => {
        res.render("pages/gestionDocument");
    }); 

    app.get('/gestionActualite', (req, res) => {
        res.render("pages/gestionActualite");
    }); 



};

module.exports =  initRoutes;
