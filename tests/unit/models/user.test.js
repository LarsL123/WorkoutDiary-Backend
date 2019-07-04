const { User } = require("../../../models/user");
const jwt = require("jsonwebtoken");
const config = require("config");

describe("user", () => {
  describe(".generateAuthToken()", () => {
    it("should return a valid jwt", () => {
      const user = new User({ isAdmin: true });
      const token = user.generateAuthToken();
      const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
      expect(decoded.isAdmin).toBe(true);
      expect(decoded._id).toBe(user._id.toHexString());
    });
  });
});
