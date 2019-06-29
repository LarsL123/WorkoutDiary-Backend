const { User } = require("../../../models/user");
const auth = require("../../../middlewear/auth");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

describe(" auth.js middlewear", () => {
  let user;
  let token;
  let req;
  let res;
  let next;
  beforeEach(() => {
    user = {
      _id: new mongoose.Types.ObjectId().toHexString(),
      isAdmin: true
    };
    token = new User(user).generateAuthToken();
    req = { header: jest.fn().mockReturnValue(token) };
    res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
    next = jest.fn();
  });
  it("should return 401 if no token is provided", () => {
    token = "";
    req = { header: jest.fn().mockReturnValue(token) };

    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });
  it("should return 400 if the token is invalid", () => {
    token = jwt.sign(
      { _id: user._id, isAdmin: user.isAdmin },
      "anInvalidPrivateKey"
    );
    req = { header: jest.fn().mockReturnValue(token) };
    auth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
  });
  it("should populate req.user with the paylod of a valid JWT", () => {
    auth(req, res, next);

    expect(req.user).toMatchObject(user);
  });
});
