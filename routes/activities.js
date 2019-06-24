const express = require("express");
const router = express.Router();
const { Activity, validate } = require("../models/activity");
const validateObjectId = require("../middlewear/validateObjectId");

router.get("/", async (req, res) => {
  const activities = await Activity.find().sort();
  res.send(activities);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const activity = await Activity.findById(req.params.id);
  if (!activity) return res.status(404).send("Did not find activity");
  res.send(activity);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let activity = new Activity({ name: req.body.name });
  activity = await activity.save();

  res.send(activity);
});

module.exports = router;
