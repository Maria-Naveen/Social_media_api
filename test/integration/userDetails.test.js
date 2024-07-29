import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../../server.js";
import User from "../../models/user.js";

let token;
beforeAll(async () => {
  const dbUri = process.env.TEST_DB_URI;
  await mongoose.connect(dbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const signupResponse = await request(app).post("/api/signup").send({
    name: "user",
    email: "user@gmail.com",
    password: "useruser",
  });
  expect(signupResponse.statusCode).toBe(201);

  const signinResponse = await request(app).post("/api/signin").send({
    email: "user@gmail.com",
    password: "useruser",
  });

  expect(signinResponse.statusCode).toBe(200);
  token = signinResponse.body.token;
});

afterAll(async () => {
  await User.deleteMany({});
  await mongoose.disconnect();
  console.log("DB disconnected");
  server.close();
});

describe("User Details Integration tests", () => {
  it("should show the details of the user", async () => {
    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`);
    // console.log(response.body);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("name", "user");
  });
  it("should return an unauthorized error on invalid token", async () => {
    token = "abc";
    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Invalid token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should return invalid token error", async () => {
    token = "";
    const response = await request(app)
      .get("/api/user")
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Unauthorized entry: Malformed token",
    };
    expect(response.body).toMatchObject(expected);
  });
});
