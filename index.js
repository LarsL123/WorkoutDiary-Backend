const express = require("express");
const app = express();
/* const logger = require("./services/logger"); */

/* logger.init();*/
require("./startup/config")();
/*
require("./startup/routes")(app);
require("./startup/db")();

require("./startup/validation")();
require("./startup/production")(app); */

const port = process.env.PORT || 3000;
const server = app.listen(port, () =>
  logger.info(`Listening on port ${port}...`)
);

module.exports = server;
