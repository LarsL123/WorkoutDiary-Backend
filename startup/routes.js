const express = require("express");
const testRoute = require("../routes/testRoute");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/test", testRoute);

  //app.use(error); // Add error middlewear ??
};
