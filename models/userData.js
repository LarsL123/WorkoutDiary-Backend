const mogoose = require("mongoose");
const { Workout } = require("./workout");
const { Sport } = require("./sport");

const UserData = mogoose.model(
  "UserData",
  new mogoose.Schema({
    user: { type: mogoose.Types.ObjectId, required: true },
    data: {
      type: [Workout.schema],
    },
    sports: {
      type: [Sport.schema],
    },
  })
);

exports.UserData = UserData;
