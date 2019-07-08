const { Workout } = require("../../../models/workout");
const mongoose = require("mongoose");

describe("workout model", () => {
  describe(".createWorkoutFromId()", () => {
    it("it should return a workout object with the given id", () => {
      const body = {
        title: "hello!",
        description: "This is a very detailed description"
      };
      const id = mongoose.Types.ObjectId();
      const workout = Workout.createWorkoutFromId(body, id);

      expect(workout).toHaveProperty("_id", id);
      expect(workout).toHaveProperty("title", body.title);
      expect(workout).toHaveProperty("description", body.description);
    });
  });
  describe(".createNewWorkout()", () => {
    it("it should return a workout object with the properties of the body object", () => {
      const body = { title: "title", description: "A detailed description" };
      const workout = Workout.createNewWorkout(body);

      expect(workout).toHaveProperty("_id");
      expect(workout).toHaveProperty("title", body.title);
      expect(workout).toHaveProperty("description", body.description);
    });
  });
});
