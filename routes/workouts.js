const express = require("express");
const router = express.Router();
const validateObjectId = require("../middlewear/validateObjectId");
const auth = require("../middlewear/auth");
const joiValidation = require("../middlewear/joiValidation");
const validateParam = require("../middlewear/validateParam");

const { Workout, validate } = require("../models/workout");
const { UserData } = require("../models/userData");
const mongoose = require("mongoose");

router.get("/", auth, async (req, res) => {
  const { data } = await UserData.findOne(
    {
      user: mongoose.Types.ObjectId(req.user._id)
    },
    { data: 1 }
  );

  data.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });

  res.send(data);
});

router.get(
  "/:from/:to",
  [
    auth,
    validateParam(Workout.validateDate, "from"),
    validateParam(Workout.validateDate, "to")
  ],
  async (req, res) => {
    const response = await UserData.aggregate([
      // Filter possible documents
      { $match: { user: mongoose.Types.ObjectId(req.user._id) } },

      // Unwind the array to denormalize
      { $unwind: "$data" },

      // Match specific array elements
      {
        $match: {
          "data.date": {
            $gte: Workout.toUTCDate(req.params.from),
            $lte: Workout.toUTCDate(req.params.to)
          }
        }
      },

      // Group back to array form
      {
        $group: {
          _id: "$_id",
          data: { $push: "$data" }
        }
      }
    ]);

    if (response.length === 0) return res.send([]);

    const data = response[0].data;
    data.sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });

    res.send(data);
  }
);

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
