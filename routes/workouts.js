const express = require("express");
const router = express.Router();
const validateObjectId = require("../middlewear/validateObjectId");
const auth = require("../middlewear/auth");
const joiValidation = require("../middlewear/joiValidation");

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
router.post("/", [auth, joiValidation(validate)], async (req, res) => {
  const workout = Workout.createNewWorkout(req.body);

  await UserData.findOneAndUpdate(
    { user: mongoose.Types.ObjectId(req.user._id) },
    { $push: { data: workout } }
  );

  res.send(workout);
});
router.put(
  "/:id",
  [auth, validateObjectId, joiValidation(validate)],
  async (req, res) => {
    const newWorkout = Workout.createWorkoutFromId(req.body, req.params.id);

    const result = await UserData.updateOne(
      { user: req.user._id, "data._id": req.params.id },
      { $set: { "data.$": newWorkout } }
    );

    if (result.n === 0) {
      return res.status(404).send("The workout does not exist");
    }

    if (result.nModified === 0) {
      return res.send("No workout was modified.");
    }

    res.send(newWorkout);
  }
);
router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const workouts = await UserData.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { data: { _id: req.params.id } } }
  );

  const deletedWorkout = workouts.data.find(w => w._id == req.params.id); //Returns true if the deleted document existed before the delete operation.
  if (!deletedWorkout) return res.status(404).send("Did not find the workout");
  res.send(deletedWorkout);
});

module.exports = router;
