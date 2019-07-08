const mongoose = require("mongoose");
const joi = require("joi");

let Workout;

const workoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  type: { type: String, default: "other" }
});

function validateWorkout(workout) {
  const schema = {
    title: joi.string().required(),
    type: joi.string(),
    description: joi.string()
  };
  return joi.validate(workout, schema);
}

workoutSchema.statics.createWorkoutFromId = function(body, id) {
  const workout = new Workout(body);
  workout._id = id;
  console.log(workout);
  return workout;
};

workoutSchema.statics.createNewWorkout = function(body) {
  const workout = body;
  return new Workout(workout);
};

Workout = mongoose.model("Workout", workoutSchema);

exports.Workout = Workout;
exports.validate = validateWorkout;
