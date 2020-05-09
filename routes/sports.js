const express = require("express");
const router = express.Router();
const { Sport, validate } = require("../models/sport");
const validateObjectId = require("../middlewear/validateObjectId");
const auth = require("../middlewear/auth");
const admin = require("../middlewear/admin");
const joiValdidation = require("../middlewear/joiValidation");

router.get("/", async (req, res) => {
  const sports = await Sport.find().sort();
  res.send(sports);
});

router.get("/:id", validateObjectId, async (req, res) => {
  const sport = await Sport.findById(req.params.id);
  if (!sport) return res.status(404).send("Did not find the sport");
  res.send(sport);
});

router.post("/", [auth, admin, joiValdidation(validate)], async (req, res) => {
  let sport = new Sport({ name: req.body.name });
  sport = await sport.save();

  res.send(sport);
});

router.put(
  "/:id",
  [auth, admin, validateObjectId, joiValdidation(validate)],
  async (req, res) => {
    const sport = await Sport.findByIdAndUpdate(
      req.params.id,
      { name: req.body.name },
      { new: true }
    );

    if (!sport) return res.status(404).send("Did not find the sport");
    res.send(sport);
  }
);

router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
  const sport = await Sport.findByIdAndDelete(req.params.id);
  if (!sport) return res.status(404).send("Did not find the sport");
  res.send(sport);
});

module.exports = router;
