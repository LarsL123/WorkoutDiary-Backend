const express = require("express");
const activities = require("../routes/activities");
const auth = require("../routes/authentication/auth");
const users = require("../routes/authentication/users");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/activities", activities);
  app.use("/api/auth", auth);
  app.use("/api/users", users);

  //app.use(error); // Add error middlewear ??
};
