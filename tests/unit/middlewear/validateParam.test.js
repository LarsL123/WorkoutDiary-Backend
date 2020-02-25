const validateParam = require("../../../middlewear/validateParam");
const Joi = require("joi");

describe("route param validation", () => {
  it("should return a middlewear function", () => {
    const res = validateParam(null);
    expect(res).toBeInstanceOf(Function);
  });
  
  describe("the returned middlewear-function", () => {
    let res;
    let req;
    let next;
    let mwfunc;
    let validator;
    let paramPath;
    let params;

    beforeEach(() => {
      params = { param1: "A String Parameter" };
      paramPath = "param1";
      validator = function(string1) {
        return Joi.string().required().validate(string1);
      };

      mwfunc = validateParam(validator, paramPath);
    });

    const exec = () => {
      req = { params };
      res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
      next = jest.fn();
      return mwfunc(req, res, next);
    };

    it("should return 400 if req.params[paramPath] is an object with any properties not specified in the given validator", () => {
      params[paramPath]={ notSpecified:"This is a vaue not specified in the validation schema" };
      exec();
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it("should return 400 if req.body did not contain a required argument", () => {
      delete params[paramPath];
      exec();
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it("should return 400 if the paramter is of wrong type", () => {
      params[paramPath] = 123; //Not a String
      exec();
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it("should call next if no error was found", () => {
      exec();
      expect(next).toHaveBeenCalled();
    });
  });
});
