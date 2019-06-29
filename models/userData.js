const mogoose = require("mongoose");
const Joi = require("joi");
const { Workout } = require("./workout");

const UserData = mogoose.model(
  "UserData",
  new mogoose.Schema({
    user: { type: mogoose.Types.ObjectId, required: true },
    data: {
      type: [Workout.schema] //TODO: Should i make the array of type Workouts.schema or leave it as a mixed Array?
    }
  })
);

exports.UserData = UserData;
