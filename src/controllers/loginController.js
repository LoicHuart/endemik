var salarieSchema = require('../models/salarie');  
   
var loginController={  
    async index(req,res){ 
        res.render("pages/login");
    },
  
    async auth(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        if (email && password) {
            salarieSchema.find({mail:email,mdp:password}, function(error, results, fields) {
                if (results.length > 0) {
                    req.session.loggedin = true;
                    req.session.user = results[0];
                    res.redirect('/tableauDeBord');
                } else {
                    res.render('pages/login',{error: "Email ou Mot de passe incorrect"});
                }			
                res.end();
            });
        } else {
            res.render('pages/login',{error: 'Entrer une adresse Email et un Mot de passe s\'il vous plaît'});
            res.end();
        }
    },

    async logout(req, res) {
        res.clearCookie('myCookie');
        
        req.session.destroy((err) => {
            res.redirect('/');
        });    
    }
}  
  
module.exports = loginController;  