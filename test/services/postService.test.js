import postService from "../../services/postService";
import Post from "../../models/post.js";
import { AppError, NotFoundError } from "../../utils/customErrors.js";
import Comment from "../../models/comment.js";

jest.mock("../../models/post.js");
jest.mock("../../models/comment.js");

describe("Post Service", () => {
  const mockUser = { id: "user123" };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Create post", () => {
    it("should create a post successfully", async () => {
      const postData = { description: "New post", author: mockUser.id };

      const mockPostInstance = {
        save: jest.fn().mockResolvedValue({
          description: postData.description,
          author: postData.author,
        }), // Mock save to return post data
      };
      Post.mockImplementation(() => mockPostInstance);

      const result = await postService.createPost(postData, mockUser);

      expect(Post).toHaveBeenCalledWith({
        description: postData.description,
        author: mockUser.id,
      }); // Ensure Post constructor is called with correct data
      expect(mockPostInstance.save).toHaveBeenCalled(); // Ensure save method is called
      expect(result).toEqual({
        description: postData.description,
        author: postData.author,
      }); // Check if the result matches the expected data
    });

    it("should throw AppError when post creation fails", async () => {
      const postData = { description: "New post" };

      const mockPostInstance = {
        save: jest.fn().mockRejectedValue(new Error("error")),
      };
      Post.mockImplementation(() => mockPostInstance);

      await expect(postService.createPost(postData, mockUser)).rejects.toThrow(
        AppError
      );
    });
  });

  describe("Update Post", () => {
    it("should update a post successfully", async () => {
      const params = { id: "post123" };
      const updatedData = { description: "Updated post" };
      const updatedPost = { ...updatedData, author: mockUser.id };

      Post.findOneAndUpdate.mockResolvedValue(updatedPost);

      const result = await postService.updatePost(
        params,
        updatedData,
        mockUser
      );

      expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
        {
          _id: params.id,
          author: mockUser.id,
        },
        { description: "Updated post" },
        { new: true, runValidators: true }
      );
      expect(result).toEqual(updatedPost);
    });

    it("should throw NotFoundError if post not found", async () => {
      Post.findOneAndUpdate.mockResolvedValue(null);

      await expect(
        postService.updatePost(
          { id: "post123" },
          { description: "Updated post" },
          mockUser
        )
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw AppError when post update fails", async () => {
      Post.findOneAndUpdate.mockRejectedValue(new Error("Error"));

      await expect(
        postService.updatePost(
          { id: "post123" },
          { description: "Updated post" },
          mockUser
        )
      ).rejects.toThrow(AppError);
    });
  });

  describe("Delete post", () => {
    it("should delete a post successfully", async () => {
      const mockPost = { _id: "post123", author: mockUser.id };
      Post.findOne.mockResolvedValue(mockPost);

      Comment.deleteMany.mockResolvedValue({});
      Post.deleteOne.mockResolvedValue({});

      await postService.deletePost({ id: "post123" }, mockUser);

      expect(Post.findOne).toHaveBeenCalledWith({
        _id: "post123",
        author: mockUser.id,
      });
      expect(Comment.deleteMany).toHaveBeenCalledWith({ postId: "post123" });
      expect(Post.deleteOne).toHaveBeenCalledWith({ _id: "post123" });
    });

    it("should throw NotFoundError if post not found", async () => {
      Post.findOne.mockResolvedValue(null);
      await expect(
        postService.deletePost({ id: "post123" }, mockUser)
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw AppError when post deletion fails", async () => {
      Post.findOne.mockRejectedValue(new Error("Error"));
      await expect(
        postService.deletePost({ id: "post123" }, mockUser)
      ).rejects.toThrow(AppError);
    });
  });

  describe("Get Post Details", () => {
    it("should return post details successfully", async () => {
      const mockPost = { _id: "post123", description: "Post details" };
      Post.findById.mockResolvedValue(mockPost);

      const result = await postService.getPostDetails("post123");

      expect(Post.findById).toHaveBeenCalledWith("post123");
      expect(result).toEqual(mockPost);
    });

    it("should throw NotFoundError when post is not available", async () => {
      Post.findById.mockResolvedValue(null);
      await expect(postService.getPostDetails("post123")).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw AppError when retrieving the post detail fails", async () => {
      Post.findById.mockRejectedValue(new Error("Error"));
      await expect(postService.getPostDetails("post123")).rejects.toThrow(
        AppError
      );
    });
  });

  describe("Toggle Like", () => {
    it("should unlike a post successfully", async () => {
      const mockPost = {
        _id: "post123",
        likes: ["user123"],
        save: jest.fn().mockResolvedValue({
          _id: "post123",
          likes: [],
        }),
      };
      Post.findById.mockResolvedValue(mockPost);

      const result = await postService.toggleLike("post123", "user123");

      expect(Post.findById).toHaveBeenCalledWith("post123");
      expect(mockPost.save).toHaveBeenCalled();
      expect(result.likes).not.toContain("user123");
    });

    it("should throw NotFoundError if post not found", async () => {
      Post.findById.mockResolvedValue(null);

      await expect(
        postService.toggleLike("post123", "user123")
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw AppError when toggling like fails", async () => {
      const mockPost = {
        _id: "post123",
        likes: [],
        save: jest.fn().mockRejectedValue(new Error("Error toggling like")),
      };
      Post.findById.mockResolvedValue(mockPost);

      await expect(
        postService.toggleLike("post123", "user123")
      ).rejects.toThrow(AppError);
    });
  });
});
