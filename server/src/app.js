const express = require("express");
const cors = require("cors");

const app = express();

const planetsRouter = require("./routes/planets/planets.router");

app.use(
  cors({
    options: "http://localhost:3000",
  })
);
app.use(express.json());
app.use(planetsRouter);

module.exports = app;
