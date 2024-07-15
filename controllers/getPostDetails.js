import Post from "../models/post.js";

const getPostDetails = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the post by ID and populate the comments and likes
    const post = await Post.findById(id)
      .populate("comments.author", "name") // Populate author field in comments with name
      .populate("likes", "name"); // Populate likes with user names

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Get the count of comments and likes
    const commentsCount = post.comments.length;
    const likesCount = post.likes.length;

    res.status(200).json({
      message: "Post details retrieved",
      post: {
        title: post.title,
        content: post.content,
        author: post.author,
        commentsCount,
        likesCount,
        comments: post.comments,
        likes: post.likes,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default getPostDetails;
