const express = require("express");
const activities = require("../routes/activities");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/activities", activities);

  //app.use(error); // Add error middlewear ??
};
