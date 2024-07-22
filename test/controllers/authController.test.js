import { jest } from "@jest/globals";
import request from "supertest";
import express from "express";
import authController from "../../controllers/authController.js";
import userService from "../../services/userService.js";
import errorHandler from "../../middleware/errorHandler.js"; // Import the error handler

jest.mock("../../services/userService.js", () => ({
  signup: jest.fn(),
  login: jest.fn(),
}));

const app = express();
app.use(express.json());
app.post("/signup", authController.signupController);
app.post("/login", authController.loginController);
app.use(errorHandler); // Use the error handler

describe("Auth Controller", () => {
  describe("POST /signup", () => {
    it("should signup a user and return 201 status", async () => {
      userService.signup.mockResolvedValue({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      });

      const response = await request(app).post("/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(201);
      expect(response.body).toEqual({
        id: 1,
        name: "John Doe",
        email: "john@example.com",
      });
    });

    it("should handle signup errors", async () => {
      userService.signup.mockRejectedValue(new Error("Signup failed"));

      const response = await request(app).post("/signup").send({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: "error",
        message: "Signup failed",
      });
    });

    it("should return 400 if email is missing", async () => {
      const response = await request(app).post("/signup").send({
        name: "John Doe",
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: "fail",
        message: "All fields are required.",
      });
    });

    it("should return 400 if password is missing", async () => {
      const response = await request(app).post("/signup").send({
        name: "John Doe",
        email: "john@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: "fail",
        message: "All fields are required.",
      });
    });
  });

  describe("POST /login", () => {
    it("should login a user and return 200 status", async () => {
      userService.login.mockResolvedValue({ token: "fake-jwt-token" });

      const response = await request(app)
        .post("/login")
        .send({ email: "john@example.com", password: "password123" });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ token: "fake-jwt-token" });
    });

    it("should handle login errors", async () => {
      userService.login.mockRejectedValue(new Error("Login failed"));

      const response = await request(app)
        .post("/login")
        .send({ email: "john@example.com", password: "password123" });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({
        status: "error",
        message: "Login failed",
      });
    });

    it("should return 400 if email is missing", async () => {
      const response = await request(app).post("/login").send({
        password: "password123",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: "fail",
        message: "All fields are required.",
      });
    });

    it("should return 400 if password is missing", async () => {
      const response = await request(app).post("/login").send({
        email: "john@example.com",
      });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        status: "fail",
        message: "All fields are required.",
      });
    });
  });
});
