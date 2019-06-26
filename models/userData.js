const mogoose = require("mongoose");
const Joi = require("joi");
const { Workout } = require("./workout");

const UserData = mogoose.model(
  "UserData",
  new mogoose.Schema({
    user: { type: mogoose.Types.ObjectId, required: true },
    data: {
      type: [Workout.schema]
    }
  })
);

function validateUserData(UserData) {
  const schema = {
    user: Joi.objectId().required()
  };
}

exports.UserData = UserData;
