import commentService from "../../../services/commentService.js";
import Comment from "../../../models/comment.js";
import Post from "../../../models/post.js";
import { NotFoundError } from "../../../utils/customErrors.js";

jest.mock("../../../models/comment");
jest.mock("../../../models/post");

describe("Comment Service", () => {
  const userId = "userId";
  const postId = "postId";
  const commentId = "commentId";
  const text = "Test comment";

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("addComment", () => {
    it("should add a comment to a post", async () => {
      const mockComment = {
        _id: commentId,
        text,
        author: userId,
        postId,
        save: jest
          .fn()
          .mockResolvedValue({ _id: commentId, text, author: userId, postId }),
      };
      const mockPost = { _id: postId, comments: [], save: jest.fn() };

      Comment.mockImplementation(() => mockComment);
      Post.findByIdAndUpdate = jest.fn().mockResolvedValue(mockPost);

      const result = await commentService.addComment(postId, userId, text);

      // Exclude the save method from the comment object in the equality check
      const { save, ...commentWithoutSave } = mockComment;

      expect(result).toEqual({ post: mockPost, comment: commentWithoutSave });
      expect(mockComment.save).toHaveBeenCalled();
      expect(Post.findByIdAndUpdate).toHaveBeenCalledWith(
        postId,
        { $push: { comments: mockComment._id } },
        { new: true, runValidators: true }
      );
    });

    it("should throw NotFoundError if post not found", async () => {
      const mockComment = {
        save: jest
          .fn()
          .mockResolvedValue({ _id: commentId, text, author: userId, postId }),
      };

      Comment.mockImplementation(() => mockComment);
      Post.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(
        commentService.addComment(postId, userId, text)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("deleteComment", () => {
    it("should delete a comment from a post", async () => {
      const mockPost = { _id: postId, comments: [commentId], save: jest.fn() };
      const mockComment = { _id: commentId, author: userId };

      Post.findOneAndUpdate = jest.fn().mockResolvedValue(mockPost);
      Comment.findOneAndDelete = jest.fn().mockResolvedValue(mockComment);

      const result = await commentService.deleteComment(
        postId,
        commentId,
        userId
      );

      expect(result).toEqual({ success: true, post: mockPost });
      expect(Post.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: postId, comments: commentId, author: userId },
        { $pull: { comments: commentId } },
        { new: true }
      );
      expect(Comment.findOneAndDelete).toHaveBeenCalledWith({
        _id: commentId,
        author: userId,
      });
    });

    it("should throw NotFoundError if post not found", async () => {
      Post.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(
        commentService.deleteComment(postId, commentId, userId)
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if comment not found", async () => {
      const mockPost = { _id: postId, comments: [commentId], save: jest.fn() };

      Post.findOneAndUpdate = jest.fn().mockResolvedValue(mockPost);
      Comment.findOneAndDelete = jest.fn().mockResolvedValue(null);

      await expect(
        commentService.deleteComment(postId, commentId, userId)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("updateComment", () => {
    it("should update a comment", async () => {
      const mockPost = { _id: postId };
      const mockComment = {
        _id: commentId,
        text,
        author: userId,
        save: jest
          .fn()
          .mockResolvedValue({ _id: commentId, text, author: userId }),
      };

      Post.findById = jest.fn().mockResolvedValue(mockPost);
      Comment.findOneAndUpdate = jest.fn().mockResolvedValue(mockComment);

      const result = await commentService.updateComment(
        postId,
        commentId,
        userId,
        text
      );

      expect(result).toEqual({ success: true, comment: mockComment });
      expect(Post.findById).toHaveBeenCalledWith(postId);
      expect(Comment.findOneAndUpdate).toHaveBeenCalledWith(
        { _id: commentId, author: userId },
        { $set: { text } },
        { new: true, runValidators: true }
      );
    });

    it("should throw NotFoundError if post not found", async () => {
      Post.findById = jest.fn().mockResolvedValue(null);

      await expect(
        commentService.updateComment(postId, commentId, userId, text)
      ).rejects.toThrow(NotFoundError);
    });

    it("should throw NotFoundError if comment not found", async () => {
      const mockPost = { _id: postId };

      Post.findById = jest.fn().mockResolvedValue(mockPost);
      Comment.findOneAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(
        commentService.updateComment(postId, commentId, userId, text)
      ).rejects.toThrow(NotFoundError);
    });
  });

  describe("Comment like", () => {
    it("should like a comment if not already liked", async () => {
      const comment = { _id: commentId, likes: [], save: jest.fn() };
      const post = { comments: [comment] };

      const mockPopulate = jest.fn().mockResolvedValue(post);
      Post.findById.mockReturnValue({ populate: mockPopulate });

      const result = await commentService.toggleCommentLike(
        postId,
        commentId,
        userId
      );

      expect(comment.likes).toContain(userId);
      expect(comment.save).toHaveBeenCalled();
      expect(result).toEqual({ success: true, comment, hasLiked: true });
    });

    it("should unlike a comment if already liked", async () => {
      const comment = { _id: commentId, likes: [userId], save: jest.fn() };
      const post = { comments: [comment] };
      const mockPopulate = jest.fn().mockResolvedValue(post);
      Post.findById.mockReturnValue({ populate: mockPopulate });

      const result = await commentService.toggleCommentLike(
        postId,
        commentId,
        userId
      );
      expect(comment.likes).not.toContain(userId);
      expect(comment.save).toHaveBeenCalled();
      expect(result).toEqual({ success: true, comment, hasLiked: false });
    });
    it("should throw NotFoundError if post is not fouond", async () => {
      Post.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await expect(
        commentService.toggleCommentLike(postId, commentId, userId)
      ).rejects.toThrow(NotFoundError);
    });
    it("should throw NotFoundError if comment is not found", async () => {
      const post = { comments: [] };
      Post.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(post),
      });

      await expect(
        commentService.toggleCommentLike(postId, commentId, userId)
      ).rejects.toThrow(NotFoundError);
    });
  });
});
