require("dotenv").config();
require("./src/db/mongoose");
const express = require("express");
const path = require('path');
const holidayRoutes = require("./src/routes/Holiday");
const employeeRoutes = require("./src/routes/Employee");
const loginRoutes = require("./src/routes/Login");
const publicDirectoryPath = path.join(__dirname, '../public');

const app = express();
const port = process.env.APP_PORT || 4000;

app.use(express.json());
app.use("/api", holidayRoutes);
app.use("/api", employeeRoutes);
app.use("/api", loginRoutes);
app.use(express.static(publicDirectoryPath));

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
