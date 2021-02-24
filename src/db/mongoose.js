const mongoose = require("mongoose");

mongoose.connect(
  "mongodb://" +
    process.env.DB_USERNAME +
    ":" +
    process.env.DB_PASSWORD +
    "@" +
    process.env.DB_HOST +
    "/" +
    process.env.DB_NAME +
    "?authSource=admin",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("connexion mongodb réussi");
});
