const mongoose = require("mongoose");
const joi = require("joi");

const workoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
});

function validateWorkout(workout) {
  const schema = {
    title: joi.string().required(),
    //type: Joi.string().required(),
    description: joi.string()
  };
  return joi.validate(workout, schema);
}

exports.Workout = mongoose.model("Workout", workoutSchema);
exports.validate = validateWorkout;
