require("dotenv").config();
require("./src/db/mongoose");
const express = require("express");
const path = require("path");
const publicDirectoryPath = path.join(__dirname, "public");
const holidayRoutes = require("./src/routes/Holiday");
const employeeRoutes = require("./src/routes/Employee");
const loginRoutes = require("./src/routes/Login");

const serviceRoutes = require("./src/routes/Service");

const app = express();
const port = process.env.APP_PORT || 3001;

app.use(express.static(publicDirectoryPath));
app.use(express.json());

app.use("/api", holidayRoutes);
app.use("/api", employeeRoutes);
app.use("/api", loginRoutes);
app.use("/api", serviceRoutes);
app.get(publicDirectoryPath + "/img");

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
