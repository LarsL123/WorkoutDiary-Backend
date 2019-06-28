const express = require("express");
const router = express.Router();
const { Workout, validate } = require("../models/workout");
const auth = require("../middlewear/auth");
const { UserData } = require("../models/userData");
const mongoose = require("mongoose");

//Get the last elemts of an array: https://docs.mongodb.com/manual/reference/operator/projection/slice/

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let workout = new Workout({
    title: req.body.title,
    description: req.body.description
  });

  const { data } = await UserData.findOneAndUpdate(
    { user: mongoose.Types.ObjectId(req.user._id) },
    { $push: { data: workout } },
    { new: true }
  );
  res.send(data);
});

module.exports = router;
