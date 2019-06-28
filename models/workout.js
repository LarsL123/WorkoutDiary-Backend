const mongoose = require("mongoose");

const workoutSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String }
});

function validateWorkout(workout) {
  const schema = {
    title: Joi.string().required(),
    //type: Joi.string().required(),
    description: Joi.string()
  };
  return Joi.validate(workout, schema);
}

exports.Workout = mongoose.model("Workout", workoutSchema);
exports.validate = validateWorkout;
