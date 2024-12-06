const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const planetsRouter = require("./routes/planets/planets.router");

app.use(
  cors({
    options: "http://localhost:3000",
  })
);
app.use(morgan("combined"));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use(planetsRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
