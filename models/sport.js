const mogoose = require("mongoose");
const Joi = require("joi");

const Sport = mogoose.model(
  "Sport",
  new mogoose.Schema({
    name: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 70
    }
  })
);

function validateSport(sport) {
  const schema = {
    name: Joi.string()
      .min(3)
      .max(70)
      .required()
  };
  return Joi.validate(sport, schema);
}

exports.validate = validateSport;
exports.Sport = Sport;
