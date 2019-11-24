const express = require("express");
const app = express();

//TODO implememt winston logger:
// const logger = require("./services/logger"); */
// logger.init();

require("./startup/config")();
require("./startup/db").startDB();
require("./startup/routes")(app);
require("./startup/validation")();
require("./startup/production")(app); //TODO: Need to read more about helmet...

const port = process.env.PORT || 3000;
const server = app.listen(
  port,
  () => console.log(`Listening on port ${port}...`) // Change to winston logger
);

server.on("close", async function() {
  await require("./startup/db").stopDB();
});
module.exports = server;
