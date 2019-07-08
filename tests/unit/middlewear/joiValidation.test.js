const joiValidator = require("../../../middlewear/joiValidation");
const joi = require("joi");

describe("joiValidation middlewear", () => {
  it("should return a middlewear function", () => {
    const res = joiValidator(null);
    expect(res).toBeInstanceOf(Function);
    //Check if it has the correct arguments??
  });
  describe("the returned middlewear-function", () => {
    let res;
    let req;
    let next;
    let mwfunc;
    let validator;
    let body;

    beforeEach(() => {
      body = { string1: "A string", number1: 1234 };
      validator = function(obj) {
        const schema = {
          string1: joi.string().required(),
          number1: joi.number().required()
        };

        return joi.validate(obj, schema);
      };

      mwfunc = joiValidator(validator);
    });

    const exec = () => {
      req = { body };
      res = { status: jest.fn().mockReturnValue({ send: jest.fn() }) };
      next = jest.fn();
      console.log(mwfunc(req, res, next));
      return mwfunc(req, res, next);
    };
    it("should return 400 if req.body contains any properties not specified in the given validator", () => {
      body.notSpecified =
        "This is a vaue not specified in the validation schema";
      exec();
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it("should return 400 if req.body did not contain a required argument", () => {
      delete body.string1;
      exec();
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it("should return 400 if any of the required arguments in req.body is of wrong type", () => {
      body.number1 = "notANumber";
      exec();
      expect(res.status).toHaveBeenCalledWith(400);
    });
    it("should call next if no error was found", () => {
      exec();
      expect(next).toHaveBeenCalled();
    });
  });
});
