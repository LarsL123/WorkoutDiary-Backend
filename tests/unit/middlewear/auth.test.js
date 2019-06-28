const { User } = require("../../../models/user");
const auth = require("../../../middlewear/auth");
const mongoose = require("mongoose");

describe(" auth.js middlewear", () => {
  it("should return 401 if no token is provided", () => {});
  it("should return 400 if the token is invalid", () => {});
  it("should populate req.user with the paylod of a valid JWT", () => {
    const user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    const token = new User(user).generateAuthToken();
    const req = { header: jest.fn().mockReturnValue(token) };
    const res = {};
    const next = jest.fn();

    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
