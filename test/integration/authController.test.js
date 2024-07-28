import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { app, server } from "../../server.js";
import User from "../../models/user.js";
dotenv.config({ path: ".env.test" });

beforeAll(async () => {
  const dbUri = process.env.TEST_DB_URI;
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  console.log("DB disconnected");
  server.close();
});

describe("Auth Integration Tests", () => {
  it("should signup a new user", async () => {
    //actual response
    const response = await request(app).post("/api/signup").send({
      name: "John",
      email: "john@example.com",
      password: "password123",
    });

    //expected response
    expect(response.status).toBe(201);

    const expectedRes = {
      message: "User created successfully!",
    };

    //assertion
    expect(response.body).toMatchObject(expectedRes);
  });

  it("should return a message saying that user already exists", async () => {
    //actual response
    const response = await request(app).post("/api/signup").send({
      name: "John",
      email: "john@example.com",
      password: "password123",
    });

    //expected response
    expect(response.status).toBe(400);
    const expectedRes = {
      status: "fail",
      message: "User already exists.",
    };

    //assertion
    expect(response.body).toMatchObject(expectedRes);
  });

  it("should throw an error saying that email and password is required", async () => {
    //actual response
    const response = await request(app).post("/api/signup").send({
      name: "Vishal",
    });

    //expected response
    expect(response.statusCode).toBe(400);
    const expectedRes = {
      message: "Email is required; Password is required",
    };
    //assertion
    expect(response.body).toMatchObject(expectedRes);
  });

  it("should throw email required error", async () => {
    //api response
    const response = await request(app)
      .post("/api/signup")
      .send({ name: "Vishal", password: "vishalvishal" });

    //expected res
    expect(response.status).toBe(400);

    const expectedRes = {
      message: "Email is required",
    };

    //assertion
    expect(response.body).toMatchObject(expectedRes);
  });
  it("should throw password required error", async () => {
    //api response
    const response = await request(app)
      .post("/api/signup")
      .send({ name: "Vishal", email: "vishal@example.com" });

    //expected res
    expect(response.status).toBe(400);

    const expectedRes = {
      message: "Password is required",
    };

    //assertion
    expect(response.body).toMatchObject(expectedRes);
  });

  it("should throw invalid password message", async () => {
    //actual response
    const response = await request(app)
      .post("/api/signin")
      .send({ email: "john@example.com", password: "wrongpassword" });

    //expected response
    expect(response.status).toBe(401);
    const expectedRes = {
      message: "Password is incorrect.",
    };

    //assertion
    expect(response.body).toMatchObject(expectedRes);
  });
  it("should throw invalid email message", async () => {
    //actual response
    const response = await request(app)
      .post("/api/signin")
      .send({ email: "wrongemail.com", password: "password123" });

    //expected response
    expect(response.status).toBe(400);
    const expectedRes = {
      message: "Email must be a valid email address.",
    };

    //assertion
    expect(response.body).toMatchObject(expectedRes);
  });
  it("should throw email required error", async () => {
    //api response
    const response = await request(app)
      .post("/api/signin")
      .send({ password: "password123" });

    //expected res
    expect(response.status).toBe(400);

    const expectedRes = {
      message: "Email is required.",
    };

    //assertion
    expect(response.body).toMatchObject(expectedRes);
  });
  it("should throw password required error", async () => {
    //api response
    const response = await request(app)
      .post("/api/signin")
      .send({ email: "john@example.com" });

    //expected res
    expect(response.status).toBe(400);

    const expectedRes = {
      message: "Password is required.",
    };

    //assertion
    expect(response.body).toMatchObject(expectedRes);
  });
});
