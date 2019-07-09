const mongoose = require("mongoose");
const joi = require("joi");

let Workout;

const workoutSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  type: { type: String },
  date: { type: Date, default: Date.now },
  kilometers: { type: Number, min: 0, max: 1000 },
  zones: {
    1: { type: Number, min: 0 },
    2: { type: Number, min: 0 },
    3: { type: Number, min: 0 },
    4: { type: Number, min: 0 },
    5: { type: Number, min: 0 },
    6: { type: Number, min: 0 },
    7: { type: Number, min: 0 }
  }
});

function validateWorkout(workout) {
  const schema = {
    title: joi.string(),
    type: joi.string(),
    description: joi.string(),
    date: joi.date(),
    kilometers: joi
      .number()
      .min(0)
      .max(1000),
    zones: {
      1: joi.number().min(0),
      2: joi.number().min(0),
      3: joi.number().min(0),
      4: joi.number().min(0),
      5: joi.number().min(0),
      6: joi.number().min(0),
      7: joi.number().min(0)
    }
  };
  return joi.validate(workout, schema);
}

workoutSchema.statics.createWorkoutFromId = function(body, id) {
  const workout = new Workout(body);
  workout._id = id;
  return workout;
};

workoutSchema.statics.createNewWorkout = function(body) {
  const workout = body;
  return new Workout(workout);
};

Workout = mongoose.model("Workout", workoutSchema);

exports.Workout = Workout;
exports.validate = validateWorkout;
