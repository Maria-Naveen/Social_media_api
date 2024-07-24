import postService from "../../services/postService.js";
import Post from "../../models/post.js";
import Comment from "../../models/comment.js";
import { AppError, NotFoundError } from "../../utils/customErrors.js";

jest.mock("../../models/post");
jest.mock("../../models/comment");

describe("Post Controller", () => {
  const user = { id: "userId" };
  const postData = { description: "Test post" };
  const postId = "postId";
  const params = { id: postId };
  const updateData = { description: "Updated post" };

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createPost", () => {
    it("should create a new post", async () => {
      const mockPost = {
        description: postData.description,
        author: user.id,
        save: jest.fn().mockResolvedValue({
          description: postData.description,
          author: user.id,
        }),
      };

      Post.mockImplementation(() => mockPost);

      const result = await postService.createPost(postData, user);
      expect(result).toMatchObject({
        description: postData.description,
        author: user.id,
      });
      expect(mockPost.save).toHaveBeenCalled();
    });

    it("should throw an error if post creation fails", async () => {
      const mockPost = {
        description: postData.description,
        author: user.id,
        save: jest.fn().mockRejectedValue(new Error("Error")),
      };

      Post.mockImplementation(() => mockPost);

      await expect(postService.createPost(postData, user)).rejects.toThrow(
        AppError
      );
      expect(mockPost.save).toHaveBeenCalled();
    });
  });

  describe("updatePost", () => {
    it("should update an existing post", async () => {
      Post.findOneAndUpdate = jest.fn().mockResolvedValue(updateData);
      const result = await postService.updatePost(params, updateData, user);
      expect(result).toEqual(updateData);
      expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: postId, author: user.id },
        { description: updateData.description },
        { new: true, runValidators: true }
      );
    });

    it("should throw NotFoundError if post not found", async () => {
      Post.findOneAndUpdate = jest.fn().mockResolvedValue(null);
      await expect(
        postService.updatePost(params, updateData, user)
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw AppError if update fails", async () => {
      Post.findOneAndUpdate = jest.fn().mockRejectedValue(new Error("Error"));
      await expect(
        postService.updatePost(params, updateData, user)
      ).rejects.toThrow(AppError);
    });
  });

  describe("deletePost", () => {
    it("should delete an existing post", async () => {
      Post.findOne = jest.fn().mockResolvedValue(postData);
      Comment.deleteMany = jest.fn().mockResolvedValue({});
      Post.deleteOne = jest.fn().mockResolvedValue({});
      await postService.deletePost(params, user);
      expect(Post.findOne).toHaveBeenCalledWith({
        _id: postId,
        author: user.id,
      });
      expect(Comment.deleteMany).toHaveBeenCalledWith({ postId });
      expect(Post.deleteOne).toHaveBeenCalledWith({ _id: postId });
    });

    it("should throw NotFoundError if post not found", async () => {
      Post.findOne = jest.fn().mockResolvedValue(null);
      await expect(postService.deletePost(params, user)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw AppError if deletion fails", async () => {
      Post.findOne = jest.fn().mockRejectedValue(new Error("Error"));
      await expect(postService.deletePost(params, user)).rejects.toThrow(
        AppError
      );
    });
  });

  describe("getPostDetails", () => {
    it("should return post details", async () => {
      Post.findById = jest.fn().mockResolvedValue(postData);
      const result = await postService.getPostDetails(postId);
      expect(result).toEqual(postData);
      expect(Post.findById).toHaveBeenCalledWith(postId);
    });

    it("should throw NotFoundError if post not found", async () => {
      Post.findById = jest.fn().mockResolvedValue(null);
      await expect(postService.getPostDetails(postId)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw AppError if fetching details fails", async () => {
      Post.findById = jest.fn().mockRejectedValue(new Error("Error"));
      await expect(postService.getPostDetails(postId)).rejects.toThrow(
        AppError
      );
    });
  });

  describe("toggleLike", () => {
    it("should toggle like on a post", async () => {
      const post = {
        likes: {
          includes: jest.fn().mockReturnValue(false),
          push: jest.fn(),
          pull: jest.fn(),
        },
        save: jest.fn().mockResolvedValue({}),
      };
      Post.findById = jest.fn().mockResolvedValue(post);
      const result = await postService.toggleLike(postId, user.id);
      expect(result).toEqual(post);
      expect(Post.findById).toHaveBeenCalledWith(postId);
      expect(post.likes.push).toHaveBeenCalledWith(user.id);
      expect(post.save).toHaveBeenCalled();
    });

    it("should throw NotFoundError if post not found", async () => {
      Post.findById = jest.fn().mockResolvedValue(null);
      await expect(postService.toggleLike(postId, user.id)).rejects.toThrow(
        NotFoundError
      );
    });

    it("should throw AppError if toggling like fails", async () => {
      Post.findById = jest.fn().mockRejectedValue(new Error("Error"));
      await expect(postService.toggleLike(postId, user.id)).rejects.toThrow(
        AppError
      );
    });
  });
});
