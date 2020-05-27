const mongoose = require("mongoose");
const Joi = require("joi");
const { Sport } = require("./sport");

let Workout;

const workoutSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  sport: { type: Sport.schema },
  date: { type: Date, default: Date.now },
  kilometers: { type: Number, min: 0, max: 1000 },
  zones: {
    1: { type: Number, min: 0, default: 0 },
    2: { type: Number, min: 0, default: 0 },
    3: { type: Number, min: 0, default: 0 },
    4: { type: Number, min: 0, default: 0 },
    5: { type: Number, min: 0, default: 0 },
    6: { type: Number, min: 0, default: 0 },
    7: { type: Number, min: 0, default: 0 },
  },
});

function validateWorkout(workout) {
  const schema = {
    title: Joi.string(),
    sport: Joi.objectId(),
    description: Joi.string(),
    date: Joi.date(),
    kilometers: Joi.number().min(0).max(1000),
    zones: {
      1: Joi.number().min(0),
      2: Joi.number().min(0),
      3: Joi.number().min(0),
      4: Joi.number().min(0),
      5: Joi.number().min(0),
      6: Joi.number().min(0),
      7: Joi.number().min(0),
    },
  };
  return Joi.validate(workout, schema);
}

workoutSchema.statics.createWorkoutFromId = function (body, id) {
  const workout = new Workout(body);
  workout._id = id;
  return workout;
};

workoutSchema.statics.createNewWorkout = function (body) {
  const workout = body;
  return new Workout(workout);
};

workoutSchema.statics.validateDate = function (date) {
  return Joi.date().required().validate(date);
};

workoutSchema.statics.toUTCDate = function (dateString) {
  let date = new Date(dateString);
  date -= date.getTimezoneOffset() * 60 * 1000; //timeZoneOffset in milliseconds.
  return new Date(date);
};

Workout = mongoose.model("Workout", workoutSchema);

exports.Workout = Workout;
exports.validate = validateWorkout;
