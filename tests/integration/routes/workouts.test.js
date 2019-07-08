const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { UserData } = require("../../../models/userData");
const { Workout } = require("../../../models/workout");

//TODO:
//GET /:id get a specific elemet of the array.
//GET /:(date-from)/:(date-to) return all the workouts in a specific timespan.

describe("/api/workouts", () => {
  let server;
  beforeEach(() => {
    server = require("../../../index");
  });

  afterEach(async () => {
    await server.close();
  });

  describe("Get /", () => {
    let user;
    let token;
    beforeEach(async () => {
      user = new User();
      token = user.generateAuthToken();
      workout = { title: "workout1", description: "This is a workout" };
      await user.createUserDataEntry();
      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { data: workout } }
      );
    });
    afterEach(async () => {
      await UserData.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .get("/api/workouts")
        .set("x-auth-token", token)
        .send();
    };
    it("should return 401 if the user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return an array containing the callers workouts", async () => {
      const res = await exec();

      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0]).toHaveProperty("title", "workout1");
      expect(res.body[0]).toHaveProperty("description");
    });
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

  describe("PUT /:id", () => {
    let user;
    let token;
    let workout;
    let workoutId;
    let paylod;
    beforeEach(async () => {
      user = new User();
      token = user.generateAuthToken();
      workout = new Workout({
        title: "workout1",
        description: "This is a workout"
      });
      workoutId = workout._id;
      paylod = {
        title: "newTitle",
        description: "The acitvivty has recived a new description"
      };
      await user.createUserDataEntry();
      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { data: workout } }
      );
    });

    afterEach(async () => {
      await UserData.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .put("/api/workouts/" + workoutId)
        .set("x-auth-token", token)
        .send(paylod);
    };
    it("should 401 if the user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should return 400 if the object id is invalid", async () => {
      workoutId = "123456";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if a required field is missing", async () => {
      delete paylod.title;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if the request contains an extra fields", async () => {
      paylod.randomNewProptery = "A suspicious string";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if the wourkout was not found", async () => {
      workoutId = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should update the entry in the DB", async () => {
      await exec();

      const userDataInDB = await UserData.findOne({ user: user._id });
      const workoutInDB = userDataInDB.data.find(
        w => w._id.toHexString() == workoutId
      );
      expect(workoutInDB).toHaveProperty("title", paylod.title);
      expect(workoutInDB).toHaveProperty("description", paylod.description);
    });
    it("should return the updated workout", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("title", paylod.title);
      expect(res.body).toHaveProperty("description", paylod.description);
    });
  });

  describe("DELETE /", () => {
    let user;
    let token;
    let workout;
    let workoutId;
    beforeEach(async () => {
      user = new User();
      token = user.generateAuthToken();
      workout = new Workout({
        title: "workout1",
        description: "This is a workout"
      });
      workoutId = workout._id;
      await user.createUserDataEntry();
      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { data: workout } }
      );
    });

    afterEach(async () => {
      await UserData.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .delete("/api/workouts/" + workoutId)
        .set("x-auth-token", token)
        .send();
    };

    it("should return 401 if the user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });

    it("should return 400 if the id is not a valid ObjectId", async () => {
      workoutId = "unvalidObjectId";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 404 if the workout was not found", async () => {
      workoutId = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });

    it("should delete the workout from the DB", async () => {
      await exec();
      const userDataInDB = await UserData.findOne({
        user: mongoose.Types.ObjectId(user._id)
      });
      expect(userDataInDB.data.length).toBe(0);
    });
    it("should return the deleted activity", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("title", workout.title);
      expect(res.body).toHaveProperty("description", workout.description);
    });
  });
});
