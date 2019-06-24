const mogoose = require("mongoose");
const Joi = require("joi");

const Activity = mogoose.model(
  "Activity",
  new mogoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 70
    }
  })
);

function validateActivity(activity) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(70)
      .required()
  };
  return Joi.validate(activity, schema);
}

exports.validate = validateActivity;
exports.Activity = Activity;
