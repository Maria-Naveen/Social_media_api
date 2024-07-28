import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../../server.js";
import User from "../../models/user.js";
import Post from "../../models/post.js";

let token;
let postId;
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
  await Post.deleteMany({});
  await mongoose.disconnect();
  console.log("DB disconnected");
  server.close();
});

describe("Post Controller Integration Tests", () => {
  it("should create a post successfully", async () => {
    const response = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Test post",
      });
    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty("message", "Post created");
    expect(response.body.post).toHaveProperty("_id");
    postId = response.body.post._id; // Store the postId for later use
  });
  it("should show an error that description cannot be empty", async () => {
    const response = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "",
      });
    expect(response.statusCode).toBe(400);
    const expected = {
      message: "Description cannot be empty.",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should return an unauthorized error on invalid token", async () => {
    let invalidToken = "abc";
    const response = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Invalid token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should return invalid token error", async () => {
    let emptyToken = "";
    const response = await request(app)
      .post("/api/posts")
      .set("Authorization", `Bearer ${emptyToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Unauthorized entry: Malformed token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should update a post successfully", async () => {
    const response = await request(app)
      .patch(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Updated Post",
      });

    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Post updated");
    expect(response.body.post).toMatchObject({
      _id: postId,
      description: "Updated Post",
    });
  });
  it("should return error on updating post due to invalid postId", async () => {
    let invalidPostId = "abc";
    const response = await request(app)
      .patch(`/api/posts/${invalidPostId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Updated Post",
      });
    expect(response.statusCode).toBe(500);
    const expected = {
      status: "error",
      message: "Error updating post",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should return unauthorized entry error if token is invalid", async () => {
    let invalidToken = "abc";
    const response = await request(app)
      .patch(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Invalid token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should return invalid token error if token is not provided during a post update", async () => {
    let emptyToken = "";
    const response = await request(app)
      .patch(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${emptyToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Unauthorized entry: Malformed token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not update a post if description is empty", async () => {
    const response = await request(app)
      .patch(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "",
      });

    expect(response.statusCode).toBe(400);
    const expected = {
      message: "Description cannot be empty.",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should like/unlike a post successfully", async () => {
    const response = await request(app)
      .patch(`/api/posts/${postId}/toggle-like`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("_id", postId);
    expect(response.body).toHaveProperty("likes");
    expect(Array.isArray(response.body.likes)).toBe(true);
  });
  it("should return an error if the postId is incorrect during liking/unliking a post", async () => {
    let invalidPostId = "abc";
    const response = await request(app)
      .patch(`/api/posts/${invalidPostId}/toggle-like`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        description: "Updated Post",
      });
    expect(response.statusCode).toBe(500);
    const expected = {
      status: "error",
      message: "Error toggling like",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should return an error if the token provided is invalid during liking/unliking a post", async () => {
    let invalidToken = "abc";
    const response = await request(app)
      .patch(`/api/posts/${postId}/toggle-like`)
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Invalid token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should throw error if an empty token is provided during liking/unliking a post", async () => {
    let emptyToken = "";
    const response = await request(app)
      .patch(`/api/posts/${postId}/toggle-like`)
      .set("Authorization", `Bearer ${emptyToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Unauthorized entry: Malformed token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should return the details of a valid post", async () => {
    const response = await request(app)
      .get(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body.post).toHaveProperty("_id", postId);
    expect(response.body.post).toHaveProperty("author");
    expect(response.body.post).toHaveProperty("description");
    expect(response.body.post).toHaveProperty("likes");
    expect(response.body.post).toHaveProperty("comments");
  });
  it("should return error if invalid postId is used to fetch details", async () => {
    let invalidPostId = "abc";
    const response = await request(app)
      .get(`/api/posts/${invalidPostId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
    const expected = {
      status: "error",
      message: "Error displaying post details",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should return error if invalid token is provided during fetching details of a post", async () => {
    let invalidToken = "abc";
    const response = await request(app)
      .get(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Invalid token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should return error if empty token is provided to fetch post details", async () => {
    let emptyToken = "";
    const response = await request(app)
      .get(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${emptyToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Unauthorized entry: Malformed token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should throw an error if post not found", async () => {
    let invalidPostId = "000000000000000000000000";
    const response = await request(app)
      .delete(`/api/posts/${invalidPostId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    const expected = { message: "Post not found", status: "fail" };
    expect(response.body).toMatchObject(expected);
  });
  it("should throw an error showing invalid postId", async () => {
    let invalidPostId = "abc";
    const response = await request(app)
      .delete(`/api/posts/${invalidPostId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(500);
    const expected = {
      status: "error",
      message: "Error deleting post",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should throw an error if token is invalid", async () => {
    let invalidToken = "abc";
    const response = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Invalid token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should throw an error if token is empty", async () => {
    let emptyToken = "";
    const response = await request(app)
      .patch(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${emptyToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Unauthorized entry: Malformed token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should delete a post successfully on correct credentials", async () => {
    const response = await request(app)
      .delete(`/api/posts/${postId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    const expected = {
      message: "Post deleted successfully",
    };
    expect(response.body).toMatchObject(expected);
  });
});
