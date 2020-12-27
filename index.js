const path = require("path");
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const initRoute = require("./src/route.js");
const app = express();
const port = process.env.APP_PORT || 3000;

let publicDisPath = path.join(__dirname, "./public");
app.use(express.static(publicDisPath));

app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");

mongoose.connect("mongodb://"+process.env.DB_USERNAME+":"+process.env.DB_PASSWORD+"@"+process.env.DB_HOST+"/admin", {useNewUrlParser: true, useUnifiedTopology: true});
// mongoose.connect('mongodb://root:Endemik.2020@endemikmongo.xn--pange-esa.site/admin', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("connexion mongodb réussi");
});

initRoute(app);

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})