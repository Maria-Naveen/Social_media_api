import request from "supertest";
import mongoose from "mongoose";
import { app, server } from "../../server.js";
import User from "../../models/user.js";
import Comment from "../../models/comment.js";

let token;
let postId;
let commentId;
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

  const postCreationResponse = await request(app)
    .post("/api/posts")
    .set("Authorization", `Bearer ${token}`)
    .send({
      description: "Test post",
    });
  expect(postCreationResponse.statusCode).toBe(201);
  postId = postCreationResponse.body.post._id; // Store the postId for later use
});

afterAll(async () => {
  await User.deleteMany({});
  //   await Post.deleteMany({});
  await Comment.deleteMany({});
  await mongoose.disconnect();
  console.log("DB disconnected");
  server.close();
});

describe("Comment controller integration tests", () => {
  it("should create a comment successfully", async () => {
    const response = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Test comment",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Comment added");
    expect(response.body.comment).toHaveProperty("_id");
    commentId = response.body.comment._id;
  });
  it("should not create a comment for a post that does not exist", async () => {
    let invalidPostId = "000000000000000000000000";
    const response = await request(app)
      .post(`/api/posts/${invalidPostId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Test comment",
      });
    expect(response.statusCode).toBe(404);
    const expected = {
      status: "fail",
      message: "Post not found",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not create comment if an invalid token is provided", async () => {
    let invalidToken = "abc";
    const response = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({
        text: "Test comment",
      });
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Invalid token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not create comment if an empty token is provided", async () => {
    let emptyToken = "";
    const response = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${emptyToken}`)
      .send({
        text: "Test comment",
      });
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Unauthorized entry: Malformed token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not create a comment if an empty comment text is provided", async () => {
    const response = await request(app)
      .post(`/api/posts/${postId}/comments`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "",
      });
    expect(response.statusCode).toBe(400);
    const expected = {
      message: "Comment text cannot be empty",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should update a specified comment in a specified post", async () => {
    const response = await request(app)
      .patch(`/api/posts/comments/${postId}/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Updated comment",
      });
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Comment updated");
    expect(response.body.comment).toHaveProperty("_id");
    expect(response.body.comment).toHaveProperty("text");
  });
  it("should not update comment if post is not found", async () => {
    let invalidPostId = "000000000000000000000000";
    const response = await request(app)
      .patch(`/api/posts/comments/${invalidPostId}/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Updated comment",
      });
    expect(response.statusCode).toBe(404);
    const expected = {
      status: "fail",
      message: "Post not found",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not update comment if the comment does not exist", async () => {
    let invalidCommentId = "111222333444111222333444";
    const response = await request(app)
      .patch(`/api/posts/comments/${postId}/${invalidCommentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "Updated comment",
      });
    expect(response.statusCode).toBe(404);
    const expected = {
      status: "fail",
      message: "Comment not found",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not update a comment if its text is empty", async () => {
    const response = await request(app)
      .patch(`/api/posts/comments/${postId}/${commentId}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        text: "",
      });
    expect(response.statusCode).toBe(400);
    const expected = {
      message: "Comment text cannot be empty",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not update comment if the token is invalid", async () => {
    let invalidToken = "abc";
    const response = await request(app)
      .patch(`/api/posts/comments/${postId}/${commentId}`)
      .set("Authorization", `Bearer ${invalidToken}`)
      .send({
        text: "Updated comment",
      });
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Invalid token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should toggle like if correct postId,commentId and user token is provided", async () => {
    const response = await request(app)
      .patch(`/api/posts/comments/${postId}/${commentId}/toggle-like`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("hasLiked", true || false);
    expect(response.body.comment).toHaveProperty("_id");
    expect(Array.isArray(response.body.comment.likes)).toBe(true);
  });
  it("should not allow to like/dislike if post not found", async () => {
    let invalidPostId = "000000000000000000000000";
    const response = await request(app)
      .patch(`/api/posts/comments/${invalidPostId}/${commentId}/toggle-like`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    const expected = {
      status: "fail",
      message: "Post not found",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not allow like/unlike a comment if comment is not found", async () => {
    let invalidCommentId = "111222333444111222333444";
    const response = await request(app)
      .patch(`/api/posts/comments/${postId}/${invalidCommentId}/toggle-like`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    const expected = {
      status: "fail",
      message: "Comment not found",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not like/unlike a comment if token is invalid", async () => {
    const invalidToken = "abc";
    const response = await request(app)
      .patch(`/api/posts/comments/${postId}/${commentId}/toggle-like`)
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
      .patch(`/api/posts/comments/${postId}/${commentId}/toggle-like`)
      .set("Authorization", `Bearer ${emptyToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Unauthorized entry: Malformed token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should throw post not found error when deleting a comment", async () => {
    let invalidPostId = "000000000000000000000000";
    const response = await request(app)
      .delete(`/api/posts/comments/${invalidPostId}/${commentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    const expected = {
      status: "fail",
      message: "Post not found",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should throw comment not found error while deleting a comment", async () => {
    let invalidCommentId = "111222333444111222333444";
    const response = await request(app)
      .delete(`/api/posts/comments/${postId}/${invalidCommentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(404);
    const expected = {
      status: "fail",
      message: "Comment not found",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not delete a comment if invalid token is provided", async () => {
    const invalidToken = "abc";
    const response = await request(app)
      .patch(`/api/posts/comments/${postId}/${commentId}`)
      .set("Authorization", `Bearer ${invalidToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Invalid token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should not delete a comment if empty token is provided", async () => {
    let emptyToken = "";
    const response = await request(app)
      .patch(`/api/posts/comments/${postId}/${commentId}`)
      .set("Authorization", `Bearer ${emptyToken}`);
    expect(response.statusCode).toBe(401);
    const expected = {
      message: "Unauthorized entry: Malformed token",
    };
    expect(response.body).toMatchObject(expected);
  });
  it("should delete a comment if valid token,postId and commentId are provided", async () => {
    const response = await request(app)
      .delete(`/api/posts/comments/${postId}/${commentId}`)
      .set("Authorization", `Bearer ${token}`);
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty("message", "Comment deleted");
  });
});
