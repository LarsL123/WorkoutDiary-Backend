const request = require("request");
const { User } = require("../../../models/user");

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
    let token;
    beforeEach(async () => {
      token = new User().generateAuthToken();
    });

    const exec = () => {
      return request(server)
        .post("/api/workouts")
        .set("x-auth-token", token)
        .send({});
    };
    it("should return 401 if user is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
  });
});
