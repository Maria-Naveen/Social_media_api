import jwt from "jsonwebtoken";
import User from "../../models/user.js";
import verifyUser from "../../middleware/auth.js";

jest.mock("jsonwebtoken");
jest.mock("../../models/user.js");

describe("verifyUser middleware", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      headers: {
        authorization: "Bearer token",
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it("should return 401 if no authorization header is present", () => {
    req.headers.authorization = null;

    verifyUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized entry: No token provided",
    });
  });

  it("should return 401 if token is malformed", () => {
    req.headers.authorization = "Bearer";

    verifyUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: "Unauthorized entry: Malformed token",
    });
  });

  it("should return 401 if token is invalid", () => {
    jwt.verify.mockImplementation(() => {
      throw new Error("Invalid token");
    });

    verifyUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token" });
  });

  it("should return 404 if user does not exist", async () => {
    jwt.verify.mockReturnValue({ userId: "userId" });
    User.findById.mockResolvedValue(null);

    await verifyUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "User doesn't exist" });
  });

  it("should call next if user is found", async () => {
    jwt.verify.mockReturnValue({ userId: "userId" });
    User.findById.mockResolvedValue({ id: "userId" });

    await verifyUser(req, res, next);

    expect(req.user).toEqual({ id: "userId" });
    expect(next).toHaveBeenCalled();
  });
});
