const express = require("express");
const router = express.Router();
const validateObjectId = require("../middlewear/validateObjectId");
const auth = require("../middlewear/auth");

const { Workout, validate } = require("../models/workout");
const { UserData } = require("../models/userData");
const mongoose = require("mongoose");

//Get the last elements of an array: https://docs.mongodb.com/manual/reference/operator/projection/slice/

router.get("/", auth, async (req, res) => {
  const userData = await UserData.find({
    user: mongoose.Types.ObjectId(req.user._id)
  });
  const { data } = userData[0];
  res.send(data);
});
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
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const workout = await UserData.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { data: { _id: req.params.id } } }
  );
  if (!workout) return res.status(404).send("Did not find the workout");
  res.send();
});

module.exports = router;
