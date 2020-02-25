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
  describe(".validateDate()", () => {
    it("should return null if the dates are valid", () =>{
      const dates = [new Date(), "01.05.2020", "2020-02-25T00:00:00.000+00:00"];
      
      dates.forEach(date => {
        const {error} = Workout.validateDate(date);
        expect(error).toBe(null);
      });
    });

    it("should return an exeption if the dates are invalid", () => {
      const invalidDates = [null, "200.78.20201", {date: "03.03.2020", invalidType: 123456}];
      
      invalidDates.forEach(date => {
        const {error} = Workout.validateDate(date);
        expect(error).toHaveProperty("name");
      });
    })
  })
});
