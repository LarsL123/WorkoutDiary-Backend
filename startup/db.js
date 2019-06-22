const mongoose = require("mongoose");
const logger = require("../services/logger");
const config = require("config");

module.exports = function() {
  const database = config.get("db");
  mongoose
    .connect(database, {
      useCreateIndex: true,
      useNewUrlParser: true
    })
    .then(() => logger.info(`Connected to ${database}..`))
    .catch(err => {
      logger.error(`Was not able to connect to ${database}, shutting down:`);
      process.exit(1);
    });
};
