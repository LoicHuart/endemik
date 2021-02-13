require("dotenv").config();
require("./src/db/mongoose");
const holydayRoutes = require("./src/routes/Holiday");
const employeeRoutes = require("./src/routes/Employee");
const express = require("express");

const app = express();
const port = process.env.APP_PORT || 4000;

app.use(express.json());
app.use("/api", holydayRoutes);
app.use("/api", employeeRoutes);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
