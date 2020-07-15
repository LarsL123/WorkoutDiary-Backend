const express = require("express");
const sports = require("../routes/sports");
const auth = require("../routes/authentication/auth");
const users = require("../routes/authentication/users");
const workouts = require("../routes/workouts");
const error = require("../middlewear/error");
const catchJsonParser = require("../middlewear/catchJsonParser");

module.exports = function(app) {
  app.use(express.json());
  app.use(catchJsonParser);
  app.use("/api/sports", sports);
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/workouts", workouts);

  app.use(error);
};
