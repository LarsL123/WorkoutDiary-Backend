const request = require("supertest");
const { Sport } = require("../../../models/sport");
const mongoose = require("mongoose");
const { User } = require("../../../models/user");
const { UserData } = require("../../../models/userData");

describe("/api/sports", () => {
  let server;
  let user;
  let token;

  beforeAll(async () => {
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

  describe("GET /", () => {
    let sport;

    beforeEach(async () => {
      sport = { name: "sport1" };
      await UserData.findOneAndUpdate(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { sports: sport } }
      );
    });

    const exec = async () => {
      return await request(server)
        .get("/api/sports")
        .set("x-auth-token", token)
        .send();
    };

    it("should return all sports related to that user", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).not.toBeUndefined();
      expect(res.body[0]).toHaveProperty("name", "sport1");
    });
    it("should return 401 if the user is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });
  });

  describe("POST / ", () => {
    let sport;

    beforeEach(async () => {
      sport = { name: "aNewSport" };
    });

    const exec = async () => {
      return await request(server)
        .post("/api/sports")
        .set("x-auth-token", token)
        .send(sport);
    };

    it("should store a new sport in the database", async () => {
      await exec();

      const { sports } = await UserData.findOne(
        { user: mongoose.Types.ObjectId(user._id) },
        { sports: 1 }
      );

      expect(sports[0]).toHaveProperty("name", "aNewSport");
    });

    it("should return 401 if the user is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 409 if the sport allready exists", async () => {
      const first = await exec();
      const second = await exec();

      expect(first.status).toBe(200);
      expect(second.status).toBe(409);
    });

    it("should return 400 if the request is not valid", async () => {
      delete sport.name;
      let res = await exec();
      expect(res.status).toBe(400);

      sport.name = "validName";
      sport.randomExtraProp = "This should not be here";
      res = await exec();
      expect(res.status).toBe(400);
    });
    it("should return the newly created sport if it was successfully created", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "aNewSport");
    });
  });

  describe("DELETE /:id", () => {
    let sport;
    let _id;

    beforeEach(async () => {
      sport = new Sport({ name: "sport1" });
      _id = sport._id;
      await UserData.update(
        { user: mongoose.Types.ObjectId(user._id) },
        { $push: { sports: sport } }
      );
    });

    const exec = async () => {
      return await request(server)
        .delete(`/api/sports/${_id}`)
        .set("x-auth-token", token)
        .send();
    };

    it("should delete the sport with the given id", async () => {
      await exec();

      const { sports } = await UserData.findOne(
        { user: mongoose.Types.ObjectId(user._id) },
        { sports: 1 }
      );

      expect(sports.length).toBe(0);
    });
    it("should return the deleted workout", async () => {
      const res = await exec();
      expect(res.body._id).toBe(_id.toString());
      expect(res.body).toHaveProperty("name", sport.name);
    });
    it("should return 401 id the user is not logged in", async () => {
      token = "";
      const res = await exec();

      expect(res.status).toBe(401);
    });
    it("should return 400 id the given id is invalid", async () => {
      _id = "1234invalid";
      const res = await exec();

      expect(res.status).toBe(400);
    });
    it("should return 404 if no workout with the given id was found", async () => {
      _id = mongoose.Types.ObjectId();
      const res = await exec();
      expect(res.status).toBe(404);
    });
  });

  // describe("PUT /:id", () => {
  //   let id;
  //   let newName;
  //   let sport;
  //   let token;
  //   const exec = () => {
  //     return request(server)
  //       .put("/api/sports/" + id)
  //       .set("x-auth-token", token)
  //       .send({ name: newName });
  //   };
  //   beforeEach(async () => {
  //     sport = new Sport({ name: "sport1" });
  //     await sport.save();

  //     id = sport._id;
  //     newName = "updatedName";
  //     token = new User({ isAdmin: true }).generateAuthToken();
  //   });
  //   afterEach(async () => {
  //     await Sport.deleteMany({});
  //   });
  //   it("should return 400 if objectId was invalid", async () => {
  //     id = 1;
  //     const res = await exec();
  //     expect(res.status).toBe(400);
  //   });
  //   it("should return 400 if name is less than 3 characters", async () => {
  //     newName = 12;
  //     const res = await exec();
  //     expect(res.status).toBe(400);
  //   });
  //   it("should return 400 if name is more than 70 characters", async () => {
  //     newName = Array(72).join("a");
  //     const res = await exec();
  //     expect(res.status).toBe(400);
  //   });
  //   it("should return 403 if client is not an admin", async () => {
  //     token = new User().generateAuthToken();
  //     const res = await exec();
  //     expect(res.status).toBe(403);
  //   });
  //   it("should return 401 if client is not logged in", async () => {
  //     token = "";
  //     const res = await exec();
  //     expect(res.status).toBe(401);
  //   });
  //   it("should update the genre in DB", async () => {
  //     await exec();
  //     const sport = await Sport.find({ name: "updatedName" });
  //     expect(sport).not.toBeNull();
  //   });
  //   it("should return the updated genre", async () => {
  //     const res = await exec();
  //     expect(res.body).toHaveProperty("_id");
  //     expect(res.body).toHaveProperty("name", newName);
  //   });
  // });

  // describe("DELETE /:id", () => {
  //   let sport;
  //   let id;
  //   let token;
  //   beforeEach(async () => {
  //     sport = new Sport({ name: "sport1" });
  //     await sport.save();
  //     id = sport._id;
  //     token = new User({ isAdmin: true }).generateAuthToken();
  //   });
  //   afterEach(async () => {
  //     await Sport.deleteMany({});
  //   });

  //   const exec = () => {
  //     return request(server)
  //       .delete("/api/sports/" + id)
  //       .set("x-auth-token", token)
  //       .send();
  //   };
  //   it("should return 400 if objectId was invalid", async () => {
  //     id = 123;
  //     const res = await exec();
  //     expect(res.status).toBe(400);
  //   });
  //   it("should return 404 if the id was not found", async () => {
  //     id = mongoose.Types.ObjectId();
  //     const res = await exec();
  //     expect(res.status).toBe(404);
  //   });
  //   it("should return 403 if client is not an admin", async () => {
  //     token = new User().generateAuthToken();
  //     const res = await exec();
  //     expect(res.status).toBe(403);
  //   });
  //   it("should return 401 if client is not logged in", async () => {
  //     token = "";
  //     const res = await exec();
  //     expect(res.status).toBe(401);
  //   });
  //   it("should delete the sport", async () => {
  //     await exec();
  //     const sport = await Sport.findById(id);
  //     expect(sport).toBeNull();
  //   });
  //   it("should retrun the deleted genre", async () => {
  //     const res = await exec();
  //     expect(res.body).toHaveProperty("name", "sport1");
  //   });
  // });
});
