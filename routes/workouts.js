const express = require("express");
const router = express.Router();
const { Workout, validate } = require("../models/workout");
const auth = require("../middlewear/auth");

router.post("/", auth, async (req, res) => {
  // const { error } = validate(req.body);
  // if (error) return res.status(400).send(error.details[0].message);
  // let workout = new Workout({
  //   title: req.body.title,
  //   description: req.body.description
  // });
  // //Save workout to a
  // res.send(workout);
});

module.exports = router;
