const request = require("supertest");
const { Sport } = require("../../../models/sport");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");


describe("/api/sports", () => {
  let server;

  beforeAll(async () => {
    server = require("../../../index");
    await Sport.deleteMany({});
  });

  afterAll(async () => {
    await server.close();
  });

  describe("GET /", () => {
    afterEach(async () => {
      await Sport.deleteMany({});
    });
    it("should return all sports in the database", async () => {
      await Sport.collection.insertMany([
        { name: "sport1" },
        { name: "sport2" },
        { name: "sport3" }
      ]);
      const res = await request(server).get("/api/sports");
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(3);
      expect(res.body.some(g => g.name === "sport1")).toBeTruthy();
    });
  });
  describe("GET /:id", () => {
    let id;
    beforeEach(async () => {
      const sport = new Sport({ name: "sport1" });
      await sport.save();
      id = sport._id;
    });
    afterEach(async () => {
      await Sport.deleteMany({});
    });
    const exec = () => {
      return request(server)
        .get("/api/sports/" + id)
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
    it("should return the sport with the given id", async () => {
      const res = await exec();
      expect(res.body.name).toBe("sport1");
    });
  });

  describe("POST /", () => {
    let name;
    let token;
    beforeEach(() => {
      name = "sport1";
      token = new User({ isAdmin: true }).generateAuthToken();
    });

    afterEach(async () => {
      await Sport.deleteMany({});
    });
    const exec = () => {
      return request(server)
        .post("/api/sports")
        .set("x-auth-token", token)
        .send({ name });
    };

    it("should return 400 if the name is more than 70 characters", async () => {
      name = Array(72).join("a");
      const res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return 400 if the name is less than 3 characters", async () => {
      name = "AB";
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
    it("should save the sport if it was valid", async () => {
      await exec();
      const sport = await Sport.find({ name: "sport1" });
      expect(sport).not.toBeNull();
    });
    it("should return the sport if it was successfully created", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "sport1");
    });
  });
  describe("PUT /:id", () => {
    let id;
    let newName;
    let sport;
    let token;
    const exec = () => {
      return request(server)
        .put("/api/sports/" + id)
        .set("x-auth-token", token)
        .send({ name: newName });
    };
    beforeEach(async () => {
      sport = new Sport({ name: "sport1" });
      await sport.save();

      id = sport._id;
      newName = "updatedName";
      token = new User({ isAdmin: true }).generateAuthToken();
    });
    afterEach(async () => {
      await Sport.deleteMany({});
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
      const sport = await Sport.find({ name: "updatedName" });
      expect(sport).not.toBeNull();
    });
    it("should return the updated genre", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", newName);
    });
  });

  describe("DELETE /:id", () => {
    let sport;
    let id;
    let token;
    beforeEach(async () => {
      sport = new Sport({ name: "sport1" });
      await sport.save();
      id = sport._id;
      token = new User({ isAdmin: true }).generateAuthToken();
    });
    afterEach(async () => {
      await Sport.deleteMany({});
    });

    const exec = () => {
      return request(server)
        .delete("/api/sports/" + id)
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
    it("should delete the sport", async () => {
      await exec();
      const sport = await Sport.findById(id);
      expect(sport).toBeNull();
    });
    it("should retrun the deleted genre", async () => {
      const res = await exec();
      expect(res.body).toHaveProperty("name", "sport1");
    });
  });
});
