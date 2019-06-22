const request = require("supertest");
const { Activity } = require("../../../models/activity");

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
});
