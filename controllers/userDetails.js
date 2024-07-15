import User from "../models/user.js";
const userDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).populate("posts");
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }
    const userName = user.name;
    const userPosts = user.posts.map((post) => ({
      title: post.title,
      description: post.description,
      createdAt: post.createdAt,
    }));
    res.status(200).json({ name: userName, posts: userPosts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

export default userDetails;
