const express = require("express");
const router = express.Router();
const { Activity, validate } = require("../models/activity");
const validateObjectId = require("../middlewear/validateObjectId");
const auth = require("../middlewear/auth");
const admin = require("../middlewear/admin");
const joiValdidation = require("../middlewear/joiValidation");

router.get("/", async (req, res) => {
  const activities = await Activity.find().sort();
  res.send(activities);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) return res.status(404).send("Did not find activity");
  res.send(activity);
});

router.post("/", [auth, admin, joiValdidation(validate)], async (req, res) => {
  let activity = new Activity({ name: req.body.name });
  activity = await activity.save();

  res.send(activity);
});

router.put(
  "/:id",
  [auth, admin, validateObjectId, joiValdidation(validate)],
  async (req, res) => {
    const activity = await Activity.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!activity) return res.status(404).send("Did not find the activity");
    res.send(activity);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const activity = await Activity.findByIdAndDelete(req.params.id);
  if (!activity) return res.status(404).send("Did not find the activity");
  res.send(activity);
});

module.exports = router;
