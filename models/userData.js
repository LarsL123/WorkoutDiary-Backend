const mogoose = require("mongoose");
const Joi = require("joi");

const UserData = mogoose.model(
  "UserData",
  new mogoose.Schema({
    user: {}, //Link to the user.
    data: {} //All data for all workouts for this user.
  })
);

exports.Activity = Activity;
