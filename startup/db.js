const mongoose = require("mongoose");
// logger = require("../services/logger");
const config = require("config");

module.exports = function() {
  const database = config.get("db");
  mongoose
    .connect(database, {
      useCreateIndex: true,
      useNewUrlParser: true,
      useFindAndModify: false
    })
    .then(() => console.log(`Connected to ${database}..`)) //TODO Change to default logger
    .catch(err => {
      console.error(`Was not able to connect to ${database}, shutting down:`); //TODO Change to default logger
      process.exit(1);
    });
};
