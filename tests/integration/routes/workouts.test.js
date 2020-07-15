const request = require("supertest");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { UserData } = require("../../../models/userData");
const { Workout } = require("../../../models/workout");
const { Sport } = require("../../../models/sport");

//TODO:
//GET /:id get a specific elemet of the array.
//GET /:(date-from)/:(date-to) return all the workouts in a specific timespan.

describe("/api/workouts", () => {
  let server;
  let user;
  let token;

  beforeAll(() => {
    server = require("../../../index");
  });

  afterAll(async () => {
    await server.close();
  });

  beforeEach(async () => {
    user = new User();
    token = user.generateAuthToken();
    await user.createUserDataEntry();
  });

  afterEach(async () => {
    await UserData.deleteMany({});
  });

  describe("Get /", () => {
    beforeEach(async () => {
      workout = { title: "workout1", description: "This is a workout" };
      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { data: workout } }
      );
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

  describe("Get /:from/:to", () => {
    let date;
    let fromDate = new Date("01.01.2019");
    let toDate = new Date("01.01.2021");

    beforeEach(async () => {
      fromDate = new Date("01.01.2019");
      date = new Date("01.01.2020");
      toDate = new Date("01.01.2021");

      workout = {
        title: "workout1",
        description: "This is a workout",
        date: date,
      };

      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { data: workout } }
      );
    });

    const exec = () => {
      return request(server)
        .get(`/api/workouts/${fromDate}/${toDate}`)
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
    it("should return 200 and an empty array if there are no workouts in the given timespan", async () => {
      formDate = new Date("01.01.1995");
      toDate = new Date("01.01.1996");
      const res = await exec();
      expect(res.status).toBe(200);
      expect(res.data).toBe(undefined);
    });
  });

  describe("POST /", () => {
    let workout;

    beforeEach(async () => {
      workout = { title: "workout1", description: "This is a workout" };
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

    it("should return 400 if an undefined fealds are sendt", async () => {
      workout = { aRandomValue: "randomString" };
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should return 400 if the given sport dont exists for the specific user", async () => {
      workout.sport = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(400);
    });

    it("should store the sport to the workouts if a valid sport is given", async () => {
      const sport = new Sport({ name: "sport1" });
      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { sports: sport } }
      );
      workout.sport = sport._id;

      await exec();

      const res = await UserData.findOne({ user: user._id });

      expect(res.data[0]).toHaveProperty("sport._id", sport._id);
      expect(res.data[0]).toHaveProperty("sport.name", "sport1");
    });

    it("should save the workout to the correct user", async () => {
      await exec();
      const res = await UserData.findOne({ user: user._id });

      expect(res.data[0]).toHaveProperty("title", "workout1");
      expect(res.data[0]).toHaveProperty("description", "This is a workout");
    });

    it("should return the newly created workout object", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("title", "workout1");
      expect(res.body).toHaveProperty("description", "This is a workout");
    });
  });

  describe("PUT /:id", () => {
    let workout;
    let workoutId;
    let paylod;
    beforeEach(async () => {
      workout = new Workout({
        title: "workout1",
        description: "This is a workout",
      });
      workoutId = workout._id;
      paylod = {
        title: "newTitle",
        description: "The acitvivty has recived a new description",
      };
      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { data: workout } }
      );
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
    it("should return 400 if the request contains any extra fields", async () => {
      paylod.randomNewProptery = "A suspicious string";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 404 if the wourkout was not found", async () => {
      workoutId = new mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it("should update the entry in the DB", async () => {
      await exec();

      const userDataInDB = await UserData.findOne({ user: user._id });
      const workoutInDB = userDataInDB.data.find(
        (workout) => workout._id.toHexString() == workoutId
      );
      expect(workoutInDB).toHaveProperty("title", paylod.title);
      expect(workoutInDB).toHaveProperty("description", paylod.description);
    });
    it("should add the sport, matching the given sport objectId, to the new workout object", async () => {
      const sport = new Sport({ name: "sport1" });
      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { sports: sport } }
      );
      paylod.sport = sport._id;

      const res = await exec();

      expect(res.body.sport).toMatchObject({
        _id: sport._id.toString(),
        name: sport.name,
      });
    });
    it("should return the updated workout", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("title", paylod.title);
      expect(res.body).toHaveProperty("description", paylod.description);
    });
  });

  describe("DELETE /", () => {
    let workout;
    let workoutId;

    beforeEach(async () => {
      workout = new Workout({
        title: "workout1",
        description: "This is a workout",
      });
      workoutId = workout._id;
      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { data: workout } }
      );
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
        user: mongoose.Types.ObjectId(user._id),
      });
      expect(userDataInDB.data.length).toBe(0);
    });
    it("should return the deleted activity", async () => {
      const res = await exec();
      expect(res.body).toMatchObject({
        _id: workoutId.toString(),
        title: workout.title,
        description: workout.description,
      });
    });
  });
});
