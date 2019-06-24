const request = require("supertest");
const { Activity } = require("../../../models/activity");
const mongoose = require("mongoose");

/*
 *  Endpoints:
    -Get/ returns all activities
    -get/:id returns a specific activity
    -post create a new activity [admin only!]
    -put/:id change properties for the given activity [admin only!]
    -delete/:id delete an activity [admin only!]
  *
 */
describe("/api/activities", () => {
  let server;

  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await Activity.deleteMany({});
    await server.close();
  });

  describe("GET /", () => {
    afterEach(async () => {
      await Activity.deleteMany({});
    });
    it("should return all activities in the database", async () => {
      await Activity.collection.insertMany([
        { name: "activity1" },
        { name: "activity2" },
        { name: "activity3" }
      ]);
      const res = await request(server).get("/api/activities");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(g => g.name === "activity1")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    let id;
    beforeEach(async () => {
      const activity = new Activity({ name: "activity1" });
      await activity.save();
      id = activity._id;
    });
    afterEach(() => {
      Activity.deleteMany({});
    });
    const exec = () => {
      return request(server)
        .get("/api/activities/" + id)
        .send();
    };
    it("should return 404 if the id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it("should return 404 if the id was not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it("should return the activity with the given id", async () => {
      const res = await exec();
      expect(res.body.name).toBe("activity1");
    });
  });

  describe("POST /", () => {
    let name;
    let token;
    beforeEach(() => {
      name = "activity1";
    });
    const exec = () => {
      return request(server)
        .post("/api/activities")
        .send({ name });
    };

    it("should return 400 if the name is more than 70 characters", async () => {
      name = Array(72).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if the name is less than 3 characters", async () => {
      name = "12";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 4xx if client is not an admin", () => {}); //TODO implement authorization and roles
    it("should return 401 if client is not logged in", () => {}); //TODO implement authorization
    it("should save the activity if it was valid", async () => {
      const res = await exec();
      const activity = Activity.find({ name: "genre1" });
      expect(activity).not.toBeNull();
    });
    it("should return the activity if it was successfully created", () => {});
  });
});
