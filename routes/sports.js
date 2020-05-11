const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { Sport, validate } = require("../models/sport");
const { UserData } = require("../models/userData");
const validateObjectId = require("../middlewear/validateObjectId");
const auth = require("../middlewear/auth");
const admin = require("../middlewear/admin");
const joiValdidation = require("../middlewear/joiValidation");

router.get("/", auth, async (req, res) => {
  const { sports } = await UserData.findOne(
    { user: mongoose.Types.ObjectId(req.user._id) },
    { sports: 1 }
  );
  res.send(sports);
});

router.post("/", [auth, joiValdidation(validate)], async (req, res) => {
  const sport = new Sport(req.body);

  const { nModified } = await UserData.updateOne(
    {
      user: mongoose.Types.ObjectId(req.user._id),
      "sports.name": { $ne: sport.name },
    },
    { $push: { sports: sport } }
  );

  if (nModified === 0)
    return res.status(409).send("You can not add duplicate sports");

  res.send(sport);
});

router.delete("/:id", [auth, validateObjectId], async (req, res) => {
  const { sports } = await UserData.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { sports: { _id: req.params.id } } },
    { fields: { sports: 1 } }
  );

  const deletedSport = sports.find((sport) => sport._id == req.params.id);
  if (!deletedSport) return res.status(404).send("Did not find the sport");

  res.send(deletedSport);
});

// router.put(
//   "/:id",
//   [auth, admin, validateObjectId, joiValdidation(validate)],
//   async (req, res) => {
//     const sport = await Sport.findByIdAndUpdate(
//       req.params.id,
//       { name: req.body.name },
//       { new: true }
//     );

//     if (!sport) return res.status(404).send("Did not find the sport");
//     res.send(sport);
//   }
// );

// router.delete("/:id", [auth, admin, validateObjectId], async (req, res) => {
//   const sport = await Sport.findByIdAndDelete(req.params.id);
//   if (!sport) return res.status(404).send("Did not find the sport");
//   res.send(sport);
// });

module.exports = router;
