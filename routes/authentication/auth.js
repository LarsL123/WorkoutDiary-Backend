const _ = require("lodash");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { User } = require("../../models/user");
const joiValidation = require("../../middlewear/joiValidation");

//    Auth endpoint. All registered users uses this endpoint to login/get their JWT

router.post("/", joiValidation(validate), async (req, res) => {
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid email or password");

  const validpassword = await bcrypt.compare(req.body.password, user.password);
  if (!validpassword) return res.status(400).send("Invalid email or password");

  const token = user.generateAuthToken();

  res.send(token);
});

function validate(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .email()
      .required(),
    password: Joi.string()
      .required()
      .min(5)
      .max(255)
      .required()
  };

  return Joi.validate(user, schema);
}

module.exports = router;
