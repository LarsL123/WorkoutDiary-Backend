const error = require("../../../middlewear/error");

describe(" auth.js middlewear", () => {
  let err;
  let req;
  let res;
  let next;

  it("should return 500 when called", () => {
    res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
    next = jest.fn();

    error(err, req, res, next);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
