const { UserData } = require("../models/userData");
const mongoose = require("mongoose");

module.exports = async function(req, res, next) {
    //Should this be in middleware folder or in sport.js midel file??
    const { sport: sportId } = req.body;
    if (sportId) {
      const { sports } = await UserData.findOne(
        { user: mongoose.Types.ObjectId(req.user._id) },
        { sports: { $elemMatch: { _id: sportId } } }
      );
  
      const [sport] = sports;
  
      if (!sport)
        return res.status(400).send("The given sport does not exist");
  
      req.body.sport = sport;
    }
    next();
}