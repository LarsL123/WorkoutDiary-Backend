const request = require("supertest");
const { Activity } = require("../../../models/activity");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");

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
    it("should return 400 if the id is invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(400);
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
      token = new User({ isAdmin: true }).generateAuthToken();
    });
    const exec = () => {
      return request(server)
        .post("/api/activities")
        .set("x-auth-token", token)
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
    it("should return 403 if client is not an admin", async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should save the activity if it was valid", async () => {
      const res = await exec();
      const activity = await Activity.find({ name: "activity1" });
      expect(activity).not.toBeNull();
    });
    it("should return the activity if it was successfully created", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "activity1");
    });
  });
  describe("PUT /:id", () => {
    let id;
    let newName;
    let activity;
    let token;
    const exec = () => {
      return request(server)
        .put("/api/activities/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };
    beforeEach(async () => {
      activity = new Activity({ name: "activity1" });
      await activity.save();

      id = activity._id;
      newName = "updatedName";
      token = new User({ isAdmin: true }).generateAuthToken();
    });
    afterEach(async () => {
      await Activity.deleteMany({});
    });
    it("should return 400 if objectId was invalid", async () => {
      id = 1;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if name is less than 3 characters", async () => {
      newName = 12;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if name is more than 70 characters", async () => {
      newName = Array(72).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 403 if client is not an admin", async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should update the genre in DB", async () => {
      await exec();
      const activity = await Activity.find({ name: "updatedName" });
      expect(activity).not.toBeNull();
    });
    it("should return the updated genre", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DELETE /:id", async () => {
    let activity;
    let id;
    let token;
    beforeEach(async () => {
      activity = new Activity({ name: "activity1" });
      await activity.save();
      id = activity._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });
    afterEach(async () => {
      await Activity.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .delete("/api/activities/" + id)
        .set("x-auth-token", token)
        .send();
    };
    it("should return 400 if objectId was invalid", async () => {
      id = 123;
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 404 if the id was not found", async () => {
      id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
    it("should return 403 if client is not an admin", async () => {
      token = new User().generateAuthToken();
      const res = await exec();
      expect(res.status).toBe(403);
    });
    it("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    it("should delete the activity", async () => {
      await exec();
      const activity = await Activity.findById(id);
      expect(activity).toBeNull();
    });
    it("should retrun the deleted genre", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("name", "activity1");
    });
  });
});
