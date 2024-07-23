import errorHandler from "../../middleware/errorHandler";

describe("ErrorHandler middleware", () => {
  it("should handle errors and send response", () => {
    const error = new Error("Test error");
    error.statusCode = 400;
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Test error",
    });
  });
  it("should set default status code and status if not provided", () => {
    const error = new Error("Test error");
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();
    errorHandler(error, req, res, next);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Test error",
    });
  });
});
