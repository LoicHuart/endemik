const LoginController = require("./LoginController");

var FileController = {
    async uploadFile(req, res) {

        console.log(req.file.path);

        res.send({
            truc: "dfgs",
        });
    }
  };
  
module.exports = FileController;
  