const request = require("supertest");
const { User } = require("../../../models/user");
const { UserData } = require("../../../models/userData");

//DELETE => Delete an activity
//POST => Should add a new activity to the array
//PUT /:id => Edit an activity
//GET => Get all activities?? or a range of ectivities??
//GET /:id get a specific elemet of the array.
describe("/api/workouts", () => {
  let server;
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
  });

  describe("POST /", () => {
    let user;
    let token;
    let workout;
    beforeEach(async () => {
      user = new User();
      token = user.generateAuthToken();
      await user.createUserDataEntry();
      workout = { title: "workout1", description: "This is a workout" };
    });
    afterEach(async () => {
      await UserData.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .post("/api/workouts")
        .set("x-auth-token", token)
        .send(workout);
    };
    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if one of the inputvalues are incorrect", async () => {
      workout = { description: "A new description" };
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should save the workout to the correct user", async () => {
      await exec();
      const res = await UserData.findOne({ user: user._id });

      expect(res.data[0]).toHaveProperty("title", "workout1");
      expect(res.data[0]).toHaveProperty("description", "This is a workout");
    });

    it("should return the newly created workout object", async () => {
      const res = await exec();
      expect(res.body[0]).toHaveProperty("title", "workout1");
      expect(res.body[0]).toHaveProperty("description", "This is a workout");
    });
  });
});
