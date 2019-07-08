const mongoose = require("mongoose");
const joi = require("joi");

const Workout = mongoose.model(
  "Workout",
  new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    type: { type: String, default: "other" }
  })
);

function validateWorkout(workout) {
  const schema = {
    title: joi.string().required(),
    type: joi.string(),
    description: joi.string()
  };
  return joi.validate(workout, schema);
}

Workout.schema.statics.createWorkoutFromId = function(body, id) {
  const workout = body;
  workout._id = id;
  return workout;
};

Workout.schema.statics.createNewWorkout = function(body) {
  const workout = body;
  return new Workout(workout);
};

exports.Workout = Workout;
exports.validate = validateWorkout;
