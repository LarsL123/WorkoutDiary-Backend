const { Workout } = require("../../../models/workout");
const mongoose = require("mongoose");

describe("workout model", () => {
  describe(".createWorkoutFromId()", () => {
    it("it should return a workout object with the given id", () => {
      const body = { prop1: "hello!", prop2: 12345 };
      const id = mongoose.Types.ObjectId();
      const workout = Workout.createWorkoutFromId(body, id);

      expect(workout).toHaveProperty("_id", id);
      expect(workout).toHaveProperty("prop1", "hello!");
      expect(workout).toHaveProperty("prop2", 12345);
    });
  });
  describe(".createNewWorkout()", () => {
    it("it should return a workout object with the properties of the body object", () => {
      const body = { prop1: "hello!", prop2: 12345 };
      const workout = Workout.createNewWorkout(body);

      expect(workout).toHaveProperty("_id");
      expect(workout).toHaveProperty("prop1", "hello!");
      expect(workout).toHaveProperty("prop2", 12345);
    });
  });
});
