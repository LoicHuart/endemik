const path = require("path");
const express = require('express');

const initRoute = require("./src/route.js");
const app = express();
const port = process.env.PORT || 3000;

let publicDisPath = path.join(__dirname, "./public");
app.use(express.static(publicDisPath));

app.set("view engine", "ejs");


initRoute(app);

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})