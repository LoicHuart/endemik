const path = require("path");
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const initRoute = require("./src/routes/routes");
const holydayRoutes = require("./src/routes/api/Holiday");
require("dotenv").config();

const app = express();
const port = process.env.APP_PORT || 4000;

app.use(express.static(path.join(__dirname, "./public")));
app.set("views", path.join(__dirname, "./src/views"));
app.set("view engine", "ejs");
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect(
  "mongodb://" +
    process.env.DB_USERNAME +
    ":" +
    process.env.DB_PASSWORD +
    "@" +
    process.env.DB_HOST +
    "/endemik?authSource=admin",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connexion mongodb réussi");
});

initRoute(app);
holydayRoutes(app);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
