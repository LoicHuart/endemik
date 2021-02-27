require("dotenv").config();
require("./src/db/mongoose");
const express = require("express");
const holidayRoutes = require("./src/routes/Holiday");
const employeeRoutes = require("./src/routes/Employee");
const loginRoutes = require("./src/routes/Login");
const serviceRoutes = require("./src/routes/Service");

const app = express();
const port = process.env.APP_PORT || 4000;

app.use(express.json());
app.use("/api", holidayRoutes);
app.use("/api", employeeRoutes);
app.use("/api", loginRoutes);
app.use("/api", serviceRoutes);

app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
