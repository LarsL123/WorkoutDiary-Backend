const mogoose = require("mongoose");
const Joi = require("joi");
const { Workout } = require("./workout");

const UserData = mogoose.model(
  "UserData",
  new mogoose.Schema({
    user: { type: mogoose.Types.ObjectId, required: true },
    data: {
      type: []
    }
  })
);

exports.UserData = UserData;
