const { User } = require("../../../models/user");
const { UserData } = require("../../../models/userData");

describe("user", () => {
  let server;
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await server.close();
  });

  describe(".createUserDataEntry()", () => {
    it("should all the userData object to the DB", async () => {
      const user = new User();
      await user.createUserDataEntry();
      const userDataInDB = await UserData.find({ user: user._id });
      expect(userDataInDB).not.toBeNull();
    });
  });
});