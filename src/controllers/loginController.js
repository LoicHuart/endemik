// //contain instance of user model  
// var serviceSchema = require('../models/service');  
  
//containt the function with business logics  
var loginController={  
    async index(req,res){ 
        res.render("pages/login");
    }  
  
}  
  
module.exports = loginController;  