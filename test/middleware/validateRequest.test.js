import validateRequest from "../../middleware/validateRequest.js";

describe("validateRequest middleware", () => {
  let req, res, next, validationSchema;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
    validationSchema = {
      validate: jest.fn(),
    };
  });

  it("should call next if validation passes", () => {
    validationSchema.validate.mockReturnValue({ error: null });

    const middleware = validateRequest(validationSchema);
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
  });

  it("should return 400 if validation fails", () => {
    const error = {
      details: [{ message: "Validation error" }],
    };
    validationSchema.validate.mockReturnValue({ error });

    const middleware = validateRequest(validationSchema);
    middleware(req, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Validation error",
    });
    expect(next).not.toHaveBeenCalled();
  });
});
