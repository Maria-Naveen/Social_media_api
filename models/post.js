import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    description: { type: String, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

postSchema.pre("save", async function () {
  try {
    await mongoose
      .model("User")
      .findByIdAndUpdate(
        this.author,
        { $push: { posts: this._id } },
        { new: true }
      );
  } catch (error) {
    console.error(error);
  }
});

export default mongoose.models.Post || mongoose.model("Post", postSchema);
