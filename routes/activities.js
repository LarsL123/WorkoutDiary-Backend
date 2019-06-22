const express = require("express");
const router = express.Router();
const { Activity } = require("../models/activity");

router.get("/", async (req, res) => {
  const activities = await Activity.find().sort();
  res.send(activities);
});

module.exports = router;
