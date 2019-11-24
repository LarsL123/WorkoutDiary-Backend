const express = require("express");
const app = express();
const cors = require("cors"); // --> https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b

//TODO implememt winston logger:
// const logger = require("./services/logger"); */
// logger.init();
app.use(cors());
require("./startup/config")();
require("./startup/db").startDB();
require("./startup/routes")(app);
require("./startup/validation")();
require("./startup/production")(app); //TODO: Need to read more about helmet...

const port = process.env.PORT || 4000;
const server = app.listen(
  port,
  () => console.log(`Listening on port ${port}...`) // Change to winston logger
);

server.on("close", async function() {
  await require("./startup/db").stopDB();
});
module.exports = server;
