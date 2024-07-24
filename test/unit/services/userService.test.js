import userService from "../../services/userService.js";
import User from "../../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ValidationError,
  UnauthorizedError,
  NotFoundError,
} from "../../utils/customErrors.js";

jest.mock("../../models/user.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signup", () => {
    it("should throw a ValidationError if required fields are missing", async () => {
      await expect(userService.signup("", "", "")).rejects.toThrow(
        ValidationError
      );
      await expect(userService.signup("name", "", "")).rejects.toThrow(
        ValidationError
      );
      await expect(
        userService.signup("name", "email@example.com", "")
      ).rejects.toThrow(ValidationError);
    });

    it("should throw a ValidationError if user already exists", async () => {
      User.findOne.mockResolvedValue({});

      await expect(
        userService.signup("name", "email@example.com", "password")
      ).rejects.toThrow(ValidationError);
    });

    it("should create a new user successfully", async () => {
      User.findOne.mockResolvedValue(null);
      User.prototype.save = jest.fn().mockResolvedValue({});

      const result = await userService.signup(
        "name",
        "email@example.com",
        "password"
      );

      expect(result).toEqual({ message: "User created successfully!" });
    });
  });

  describe("login", () => {
    it("should throw a NotFoundError if user does not exist", async () => {
      User.findOne.mockResolvedValue(null);

      await expect(
        userService.login("email@example.com", "password")
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw an UnauthorizedError if password is incorrect", async () => {
      const user = { password: "hashed_password" };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(false);

      await expect(
        userService.login("email@example.com", "password")
      ).rejects.toThrow(UnauthorizedError);
    });

    it("should return a token if login is successful", async () => {
      const user = { _id: "user_id", password: "hashed_password" };
      User.findOne.mockResolvedValue(user);
      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("token");

      const result = await userService.login("email@example.com", "password");

      expect(result).toEqual({ token: "token" });
    });
  });

  describe("getUserDetails", () => {
    it("should throw a NotFoundError if user does not exist", async () => {
      User.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(null),
      }));

      await expect(userService.getUserDetails("user_id")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should return user details if user exists", async () => {
      const user = {
        name: "John Doe",
        posts: [{ description: "Post 1", createdAt: "2022-01-01" }],
      };
      User.findById.mockImplementation(() => ({
        populate: jest.fn().mockResolvedValue(user),
      }));

      const result = await userService.getUserDetails("user_id");

      expect(result).toEqual({
        name: "John Doe",
        posts: [{ description: "Post 1", createdAt: "2022-01-01" }],
      });
    });
  });
});
